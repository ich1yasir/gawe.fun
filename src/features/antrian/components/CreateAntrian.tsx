'use client';

import React, { useEffect, useMemo, useState } from "react";
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../../../../lib/firebase";

type MenuKey = "dashboard" | "queues" | "details" | "client";

type QueueItem = {
  id: string;
  publicCode?: string;
  ownerId: string;
  name: string;
  prefixCode: string;
  sector: string;
  employeeRange: string;
  isOpen: boolean;
  currentNumber: number;
  lastIssuedNumber: number;
  waitingCount: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

type TicketStatus = "waiting" | "serving" | "done";

type TicketItem = {
  id: string;
  queueId: string;
  customerName: string;
  number: number;
  status: TicketStatus;
  createdAt?: Timestamp;
  calledAt?: Timestamp;
  servedAt?: Timestamp;
};

const sectors = ["Finance", "Hospitality", "Government", "Restaurant", "Other"];
const employeeRanges = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

function normalizeQueueCode(input: string) {
  return input.trim().toUpperCase();
}

function generateQueueCode(prefixCode: string) {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefixCode}-${randomPart}`;
}

function getQueueDisplayCode(queue: QueueItem) {
  return queue.publicCode ?? `${queue.prefixCode}-UNSET`;
}

const CreateAntrian: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const [queueName, setQueueName] = useState("");
  const [queuePrefixCode, setQueuePrefixCode] = useState("");
  const [queueSector, setQueueSector] = useState(sectors[0]);
  const [queueEmployeeRange, setQueueEmployeeRange] = useState(employeeRanges[0]);

  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState("");
  const [selectedQueueTickets, setSelectedQueueTickets] = useState<TicketItem[]>([]);

  const [editingQueueId, setEditingQueueId] = useState("");
  const [editQueueName, setEditQueueName] = useState("");
  const [editQueuePrefixCode, setEditQueuePrefixCode] = useState("");

  const [clientQueueCode, setClientQueueCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientTicketQueueId, setClientTicketQueueId] = useState("");
  const [clientTicketId, setClientTicketId] = useState("");
  const [clientTicketNumber, setClientTicketNumber] = useState(0);
  const [clientTicketPrefixCode, setClientTicketPrefixCode] = useState("");
  const [clientTicketQueueName, setClientTicketQueueName] = useState("");
  const [clientQueueCurrentNumber, setClientQueueCurrentNumber] = useState(0);
  const [clientQueueTickets, setClientQueueTickets] = useState<TicketItem[]>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth as Auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      setErrorMessage("");
      setInfoMessage("");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !user) {
      setQueues([]);
      return;
    }

    const queuesQuery = query(
      collection(db as Firestore, "queues"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(queuesQuery, (snapshot) => {
      const mapped = snapshot.docs.map((queueDoc) => ({
        id: queueDoc.id,
        ...(queueDoc.data() as Omit<QueueItem, "id">),
      }));

      setQueues(mapped);
      setSelectedQueueId((currentSelectedQueueId) => {
        if (mapped.length === 0) return "";
        if (currentSelectedQueueId) return currentSelectedQueueId;
        return mapped[0].id;
      });
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!db || !selectedQueueId) {
      setSelectedQueueTickets([]);
      return;
    }

    const ticketsQuery = query(
      collection(db as Firestore, "queues", selectedQueueId, "tickets"),
      orderBy("number", "asc"),
    );

    const unsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
      const mapped = snapshot.docs.map((ticketDoc) => ({
        id: ticketDoc.id,
        ...(ticketDoc.data() as Omit<TicketItem, "id">),
      }));
      setSelectedQueueTickets(mapped);
    });

    return () => unsubscribe();
  }, [selectedQueueId]);

  useEffect(() => {
    if (!db || !clientTicketQueueId) {
      setClientQueueTickets([]);
      setClientQueueCurrentNumber(0);
      return;
    }

    const queueRef = doc(db as Firestore, "queues", clientTicketQueueId);
    const queueUnsubscribe = onSnapshot(queueRef, (snapshot) => {
      const queueData = snapshot.data() as QueueItem | undefined;
      if (!queueData) return;
      setClientQueueCurrentNumber(queueData.currentNumber ?? 0);
    });

    const ticketsRef = query(
      collection(db as Firestore, "queues", clientTicketQueueId, "tickets"),
      orderBy("number", "asc"),
    );
    const ticketsUnsubscribe = onSnapshot(ticketsRef, (snapshot) => {
      const mapped = snapshot.docs.map((ticketDoc) => ({
        id: ticketDoc.id,
        ...(ticketDoc.data() as Omit<TicketItem, "id">),
      }));
      setClientQueueTickets(mapped);
    });

    return () => {
      queueUnsubscribe();
      ticketsUnsubscribe();
    };
  }, [clientTicketQueueId]);

  const selectedQueue = useMemo(
    () => queues.find((queueItem) => queueItem.id === selectedQueueId) ?? null,
    [queues, selectedQueueId],
  );

  const totalQueues = queues.length;
  const openQueues = queues.filter((queueItem) => queueItem.isOpen).length;
  const totalWaiting = queues.reduce((total, queueItem) => total + (queueItem.waitingCount ?? 0), 0);

  const clientTicket = clientQueueTickets.find((ticket) => ticket.id === clientTicketId);
  const numbersAhead = clientQueueTickets.filter(
    (ticket) =>
      ticket.number < clientTicketNumber &&
      ticket.status === "waiting" &&
      ticket.id !== clientTicketId,
  ).length;

  async function createQueue(ownerId: string) {
    if (!db) return;

    const safeName = queueName.trim();
    const safePrefixCode = queuePrefixCode.trim().toUpperCase();
    if (!safeName || !safePrefixCode) return;

    await addDoc(collection(db as Firestore, "queues"), {
      ownerId,
      name: safeName,
      prefixCode: safePrefixCode,
      publicCode: generateQueueCode(safePrefixCode),
      sector: queueSector,
      employeeRange: queueEmployeeRange,
      isOpen: true,
      currentNumber: 0,
      lastIssuedNumber: 0,
      waitingCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setQueueName("");
    setQueuePrefixCode("");
    setQueueSector(sectors[0]);
    setQueueEmployeeRange(employeeRanges[0]);
  }

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth) return;

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const email = authEmail.trim();
      if (!email || !authPassword.trim()) {
        throw new Error("Email and password are required.");
      }

      if (authMode === "register") {
        const credential = await createUserWithEmailAndPassword(
          auth as Auth,
          email,
          authPassword,
        );
        const safeInitialQueueName = queueName.trim();
        const safeInitialQueuePrefixCode = queuePrefixCode.trim();
        const hasPartialInitialQueue =
          (safeInitialQueueName && !safeInitialQueuePrefixCode) ||
          (!safeInitialQueueName && safeInitialQueuePrefixCode);
        if (hasPartialInitialQueue) {
          throw new Error("Fill both initial queue name and prefix code, or leave both empty.");
        }
        const hasInitialQueue = safeInitialQueueName && safeInitialQueuePrefixCode;
        if (hasInitialQueue) {
          try {
            await createQueue(credential.user.uid);
            setInfoMessage("Account and initial queue created successfully.");
          } catch (queueError) {
            const queueMessage =
              queueError instanceof Error ? queueError.message : "Unable to create initial queue.";
            setInfoMessage(`Account created successfully, but initial queue failed: ${queueMessage}`);
          }
        } else {
          setInfoMessage("Account created successfully.");
        }
      } else {
        const credential = await signInWithEmailAndPassword(auth as Auth, email, authPassword);
        setInfoMessage(`Welcome back, ${credential.user.email ?? "User"}.`);
      }

      setAuthEmail("");
      setAuthPassword("");
      setActiveMenu("dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleLogout() {
    if (!auth) return;

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      await signOut(auth as Auth);
      setSelectedQueueTickets([]);
      setSelectedQueueId("");
      setClientTicketQueueId("");
      setClientTicketId("");
      setClientTicketNumber(0);
      setClientQueueTickets([]);
      setClientQueueCurrentNumber(0);
      setInfoMessage("Logged out successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleCreateQueue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setErrorMessage("Please login first.");
      return;
    }

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      await createQueue(user.uid);
      setInfoMessage("Queue created successfully.");
      setActiveMenu("queues");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create queue.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  function startEditQueue(queueItem: QueueItem) {
    setEditingQueueId(queueItem.id);
    setEditQueueName(queueItem.name);
    setEditQueuePrefixCode(queueItem.prefixCode);
  }

  async function handleEditQueueSave() {
    if (!db || !editingQueueId) return;

    const safeName = editQueueName.trim();
    const safePrefixCode = editQueuePrefixCode.trim().toUpperCase();
    if (!safeName || !safePrefixCode) {
      setErrorMessage("Queue name and prefix are required.");
      return;
    }

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      await updateDoc(doc(db as Firestore, "queues", editingQueueId), {
        name: safeName,
        prefixCode: safePrefixCode,
        updatedAt: serverTimestamp(),
      });
      setEditingQueueId("");
      setEditQueueName("");
      setEditQueuePrefixCode("");
      setInfoMessage("Queue updated successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update queue.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleDeleteQueue(queueId: string) {
    if (!db) return;

    const confirmed = window.confirm("Delete this queue and all its numbers?");
    if (!confirmed) return;

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const ticketsSnapshot = await getDocs(
        collection(db as Firestore, "queues", queueId, "tickets"),
      );
      await Promise.all(
        ticketsSnapshot.docs.map((ticketDoc) =>
          deleteDoc(doc(db as Firestore, "queues", queueId, "tickets", ticketDoc.id)),
        ),
      );

      await deleteDoc(doc(db as Firestore, "queues", queueId));

      if (selectedQueueId === queueId) {
        setSelectedQueueId("");
      }

      setInfoMessage("Queue deleted successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete queue.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function toggleQueueStatus(isOpen: boolean) {
    if (!db || !selectedQueueId) return;

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      await updateDoc(doc(db as Firestore, "queues", selectedQueueId), {
        isOpen,
        updatedAt: serverTimestamp(),
      });
      setInfoMessage(`Queue ${isOpen ? "opened" : "closed"}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update queue status.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleNextNumber() {
    if (!db || !selectedQueueId) return;

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const queueRef = doc(db as Firestore, "queues", selectedQueueId);
      const queueSnapshot = await getDoc(queueRef);
      if (!queueSnapshot.exists()) {
        throw new Error("Queue not found.");
      }

      const queueData = queueSnapshot.data() as QueueItem;
      if (!queueData.isOpen) {
        throw new Error("Queue is closed.");
      }

      const servingQuery = query(
        collection(db as Firestore, "queues", selectedQueueId, "tickets"),
        where("status", "==", "serving"),
      );
      const waitingQuery = query(
        collection(db as Firestore, "queues", selectedQueueId, "tickets"),
        where("status", "==", "waiting"),
        orderBy("createdAt", "asc"),
      );

      const [servingSnapshot, waitingSnapshot] = await Promise.all([
        getDocs(servingQuery),
        getDocs(waitingQuery),
      ]);

      await Promise.all(
        servingSnapshot.docs.map((servingDoc) =>
          updateDoc(servingDoc.ref, {
            status: "done",
            servedAt: serverTimestamp(),
          }),
        ),
      );

      if (waitingSnapshot.empty) {
        setInfoMessage("No waiting numbers in this queue.");
        return;
      }

      const nextTicket = waitingSnapshot.docs[0];
      const nextData = nextTicket.data() as TicketItem;

      await Promise.all([
        updateDoc(nextTicket.ref, {
          status: "serving",
          calledAt: serverTimestamp(),
        }),
        updateDoc(queueRef, {
          currentNumber: nextData.number,
          waitingCount: Math.max(waitingSnapshot.size - 1, 0),
          updatedAt: serverTimestamp(),
        }),
      ]);

      setInfoMessage(`Now serving number ${nextData.number}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to call next number.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleDeleteTicket(ticketId: string) {
    if (!db || !selectedQueueId) return;

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const queueRef = doc(db as Firestore, "queues", selectedQueueId);
      const ticketRef = doc(db as Firestore, "queues", selectedQueueId, "tickets", ticketId);

      await runTransaction(db as Firestore, async (transaction) => {
        const queueSnapshot = await transaction.get(queueRef);
        const ticketSnapshot = await transaction.get(ticketRef);

        if (!queueSnapshot.exists() || !ticketSnapshot.exists()) {
          throw new Error("Queue number not found.");
        }

        const queueData = queueSnapshot.data() as QueueItem;
        const ticketData = ticketSnapshot.data() as TicketItem;

        transaction.delete(ticketRef);
        if (ticketData.status === "waiting") {
          transaction.update(queueRef, {
            waitingCount: Math.max((queueData.waitingCount ?? 0) - 1, 0),
            updatedAt: serverTimestamp(),
          });
        }
      });

      setInfoMessage("Queue number deleted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete number.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleClientRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!db) return;

    setLoadingAction(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const queueCode = normalizeQueueCode(clientQueueCode);
      const safeName = clientName.trim();

      if (!queueCode || !safeName) {
        throw new Error("Queue code and customer name are required.");
      }

      const queueQuery = query(
        collection(db as Firestore, "queues"),
        where("publicCode", "==", queueCode),
        limit(1),
      );
      const queueSnapshot = await getDocs(queueQuery);
      if (queueSnapshot.empty) {
        throw new Error("Queue code is invalid.");
      }

      const queueDoc = queueSnapshot.docs[0];
      const queueId = queueDoc.id;
      const queueData = queueDoc.data() as QueueItem;
      if (!queueData.isOpen) {
        throw new Error("Queue is currently closed.");
      }

      const queueRef = doc(db as Firestore, "queues", queueId);
      const ticketRef = doc(collection(db as Firestore, "queues", queueId, "tickets"));

      const ticketNumber = await runTransaction(db as Firestore, async (transaction) => {
        const queueTransactionSnapshot = await transaction.get(queueRef);
        if (!queueTransactionSnapshot.exists()) {
          throw new Error("Queue not found.");
        }

        const queueTransactionData = queueTransactionSnapshot.data() as QueueItem;
        if (!queueTransactionData.isOpen) {
          throw new Error("Queue is currently closed.");
        }

        const nextNumber = (queueTransactionData.lastIssuedNumber ?? 0) + 1;

        transaction.set(ticketRef, {
          queueId,
          customerName: safeName,
          number: nextNumber,
          status: "waiting",
          createdAt: serverTimestamp(),
        });

        transaction.update(queueRef, {
          lastIssuedNumber: nextNumber,
          waitingCount: (queueTransactionData.waitingCount ?? 0) + 1,
          updatedAt: serverTimestamp(),
        });

        return nextNumber;
      });

      setClientTicketQueueId(queueId);
      setClientTicketId(ticketRef.id);
      setClientTicketNumber(ticketNumber);
      setClientTicketPrefixCode(queueData.prefixCode);
      setClientTicketQueueName(queueData.name);
      setInfoMessage(`Registered successfully with number ${ticketNumber}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to register to queue.";
      setErrorMessage(message);
    } finally {
      setLoadingAction(false);
    }
  }

  const menuButtonClasses =
    "rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-amber-100 p-6 text-amber-900 shadow">
        Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        and NEXT_PUBLIC_FIREBASE_APP_ID in your environment.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">Antrian Management</h2>
        <p className="text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
          A clean and simple queue flow for staff and customers.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      {infoMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          {infoMessage}
        </div>
      )}

      {authLoading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Checking authentication...</p>
      ) : !user ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleAuthSubmit}
            className="space-y-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700"
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {authMode === "register" ? "Create account" : "Login"}
            </h3>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="owner@email.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            {authMode === "register" && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">Initial queue name (optional)</label>
                  <input
                    type="text"
                    value={queueName}
                    onChange={(event) => setQueueName(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="Main Counter"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Initial prefix code (optional)</label>
                  <input
                    type="text"
                    value={queuePrefixCode}
                    onChange={(event) => setQueuePrefixCode(event.target.value.toUpperCase())}
                    className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="A"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loadingAction}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loadingAction
                ? "Please wait..."
                : authMode === "register"
                  ? "Register"
                  : "Login"}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}
              className="w-full text-sm text-blue-600 hover:underline"
            >
              {authMode === "register"
                ? "Already have an account? Login"
                : "Need an account? Register"}
            </button>
          </form>

          <div className="space-y-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Simple flow</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Sign in as owner and create one or more queues.</li>
              <li>Use queue management to edit or remove queues.</li>
              <li>Open service panel to call next customer number.</li>
              <li>Use customer panel to take number and monitor status.</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700 sm:flex-row sm:items-center">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Logged in as <span className="font-semibold">{user.email}</span>
            </p>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <button
                type="button"
                className={`${menuButtonClasses} ${activeMenu === "dashboard" ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : ""}`}
                onClick={() => setActiveMenu("dashboard")}
              >
                Overview
              </button>
              <button
                type="button"
                className={`${menuButtonClasses} ${activeMenu === "queues" ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : ""}`}
                onClick={() => setActiveMenu("queues")}
              >
                Manage Queues
              </button>
              <button
                type="button"
                className={`${menuButtonClasses} ${activeMenu === "details" ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : ""}`}
                onClick={() => setActiveMenu("details")}
              >
                Service Panel
              </button>
              <button
                type="button"
                className={`${menuButtonClasses} ${activeMenu === "client" ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : ""}`}
                onClick={() => setActiveMenu("client")}
              >
                Customer Panel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </div>
          </div>

          {activeMenu === "dashboard" && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Queues</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalQueues}</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Open Queues</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{openQueues}</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Waiting Numbers</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalWaiting}</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700 md:col-span-3">
                <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">Quick actions</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    onClick={() => setActiveMenu("queues")}
                  >
                    Manage queues
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    onClick={() => setActiveMenu("details")}
                  >
                    Open service panel
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    onClick={() => setActiveMenu("client")}
                  >
                    Open customer panel
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "queues" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <form
                onSubmit={handleCreateQueue}
                className="space-y-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <h3 className="text-lg font-semibold">Create New Queue</h3>
                <div>
                  <label className="mb-1 block text-sm font-medium">Queue name</label>
                  <input
                    type="text"
                    value={queueName}
                    onChange={(event) => setQueueName(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Prefix code</label>
                  <input
                    type="text"
                    value={queuePrefixCode}
                    onChange={(event) => setQueuePrefixCode(event.target.value.toUpperCase())}
                    className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Sector</label>
                  <select
                    value={queueSector}
                    onChange={(event) => setQueueSector(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    {sectors.map((sectorItem) => (
                      <option key={sectorItem} value={sectorItem}>
                        {sectorItem}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Employee range</label>
                  <select
                    value={queueEmployeeRange}
                    onChange={(event) => setQueueEmployeeRange(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    {employeeRanges.map((rangeItem) => (
                      <option key={rangeItem} value={rangeItem}>
                        {rangeItem}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  Create Queue
                </button>
              </form>

              <div className="space-y-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                <h3 className="text-lg font-semibold">Queue List</h3>
                {queues.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No queues created yet.</p>
                ) : (
                  <div className="space-y-2">
                    {queues.map((queueItem) => (
                      <div
                        key={queueItem.id}
                        className="rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-700"
                      >
                        {editingQueueId === queueItem.id ? (
                          <div className="space-y-2">
                            <input
                              value={editQueueName}
                              onChange={(event) => setEditQueueName(event.target.value)}
                              className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <input
                              value={editQueuePrefixCode}
                              onChange={(event) => setEditQueuePrefixCode(event.target.value.toUpperCase())}
                              className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleEditQueueSave}
                                className="rounded bg-emerald-600 px-3 py-1.5 text-white"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingQueueId("");
                                  setEditQueueName("");
                                  setEditQueuePrefixCode("");
                                }}
                                className="rounded border px-3 py-1.5"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">
                                {queueItem.name} ({queueItem.prefixCode})
                              </p>
                              <span
                                className={`rounded px-2 py-0.5 text-xs font-medium ${
                                  queueItem.isOpen
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                                }`}
                              >
                                {queueItem.isOpen ? "Open" : "Closed"}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Queue code: <span className="font-mono">{getQueueDisplayCode(queueItem)}</span>
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedQueueId(queueItem.id);
                                  setActiveMenu("details");
                                }}
                                className="rounded bg-zinc-900 px-2.5 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900"
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={() => startEditQueue(queueItem)}
                                className="rounded border px-2.5 py-1 text-xs"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteQueue(queueItem.id)}
                                className="rounded border border-red-300 px-2.5 py-1 text-xs text-red-700 dark:border-red-700 dark:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMenu === "details" && (
            <div className="space-y-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
              <div>
                <label className="mb-1 block text-sm font-medium">Select queue</label>
                <select
                  value={selectedQueueId}
                  onChange={(event) => setSelectedQueueId(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value="">Select queue</option>
                  {queues.map((queueItem) => (
                    <option key={queueItem.id} value={queueItem.id}>
                      {queueItem.name} ({queueItem.prefixCode})
                    </option>
                  ))}
                </select>
              </div>

              {!selectedQueue ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose a queue to manage details.</p>
              ) : (
                <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Queue code</p>
                        <p className="font-mono text-sm">{getQueueDisplayCode(selectedQueue)}</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Current number</p>
                        <p className="text-xl font-bold">{selectedQueue.currentNumber}</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Last issued</p>
                        <p className="text-xl font-bold">{selectedQueue.lastIssuedNumber}</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Waiting</p>
                        <p className="text-xl font-bold">{selectedQueue.waitingCount}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleQueueStatus(true)}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Open Queue
                      </button>
                    <button
                      type="button"
                      onClick={() => toggleQueueStatus(false)}
                        className="rounded-full bg-zinc-600 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
                      >
                        Close Queue
                      </button>
                    <button
                      type="button"
                      onClick={handleNextNumber}
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Next Number
                      </button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Queue numbers</h4>
                    {selectedQueueTickets.length === 0 ? (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">No numbers registered yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedQueueTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-700"
                          >
                            <div>
                              <p className="font-medium">
                                {selectedQueue.prefixCode}-{ticket.number} • {ticket.customerName}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">Status: {ticket.status}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 dark:border-red-700 dark:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeMenu === "client" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <form
                onSubmit={handleClientRegister}
                className="space-y-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <h3 className="text-lg font-semibold">Queue Client Registration</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Enter queue code and customer name to get a queue number.
                </p>
                <div>
                  <label className="mb-1 block text-sm font-medium">Queue code</label>
                  <input
                    type="text"
                    value={clientQueueCode}
                    onChange={(event) => setClientQueueCode(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 font-mono dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="Example: A-ABC123"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Customer name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  Register Number
                </button>
              </form>

              <div className="space-y-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                <h3 className="text-lg font-semibold">Queue Progress</h3>
                {!clientTicketId ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No ticket registered yet.</p>
                ) : (
                  <>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">Queue: {clientTicketQueueName}</p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      Your number: {clientTicketPrefixCode}-{clientTicketNumber}
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                        <p className="text-zinc-500 dark:text-zinc-400">Current number</p>
                        <p className="text-lg font-semibold">{clientQueueCurrentNumber}</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                        <p className="text-zinc-500 dark:text-zinc-400">Numbers ahead</p>
                        <p className="text-lg font-semibold">{numbersAhead}</p>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      Status: <span className="font-semibold">{clientTicket?.status ?? "unknown"}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreateAntrian;
