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
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../../lib/firebase";

type MenuKey = "dashboard" | "queues" | "details" | "client";

type QueueItem = {
  id: string;
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
  return input.trim();
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
      if (!selectedQueueId && mapped.length > 0) {
        setSelectedQueueId(mapped[0].id);
      }
      if (mapped.length === 0) {
        setSelectedQueueId("");
      }
    });

    return () => unsubscribe();
  }, [selectedQueueId, user]);

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
      ticket.status !== "done" &&
      ticket.id !== clientTicketId,
  ).length;

  async function upsertQueue(ownerId: string) {
    if (!db) return;

    const safeName = queueName.trim();
    const safePrefixCode = queuePrefixCode.trim().toUpperCase();
    if (!safeName || !safePrefixCode) return;

    await addDoc(collection(db as Firestore, "queues"), {
      ownerId,
      name: safeName,
      prefixCode: safePrefixCode,
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
        await upsertQueue(credential.user.uid);
        setInfoMessage("Account created successfully.");
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
      await upsertQueue(user.uid);
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
      const waitingQuery = query(
        collection(db as Firestore, "queues", selectedQueueId, "tickets"),
        where("status", "==", "waiting"),
        orderBy("createdAt", "asc"),
      );
      const servingQuery = query(
        collection(db as Firestore, "queues", selectedQueueId, "tickets"),
        where("status", "==", "serving"),
      );

      const called = await runTransaction(db as Firestore, async (transaction) => {
        const queueSnapshot = await transaction.get(queueRef);
        if (!queueSnapshot.exists()) {
          throw new Error("Queue not found.");
        }

        const queueData = queueSnapshot.data() as QueueItem;
        if (!queueData.isOpen) {
          throw new Error("Queue is closed.");
        }

        const servingSnapshot = await transaction.get(servingQuery);
        servingSnapshot.docs.forEach((servingDoc) => {
          transaction.update(servingDoc.ref, {
            status: "done",
            servedAt: serverTimestamp(),
          });
        });

        const waitingSnapshot = await transaction.get(waitingQuery);
        if (waitingSnapshot.empty) {
          return 0;
        }

        const nextTicket = waitingSnapshot.docs[0];
        const nextData = nextTicket.data() as TicketItem;

        transaction.update(nextTicket.ref, {
          status: "serving",
          calledAt: serverTimestamp(),
        });

        transaction.update(queueRef, {
          currentNumber: nextData.number,
          waitingCount: Math.max((queueData.waitingCount ?? 0) - 1, 0),
          updatedAt: serverTimestamp(),
        });

        return nextData.number;
      });

      if (called === 0) {
        setInfoMessage("No waiting numbers in this queue.");
      } else {
        setInfoMessage(`Now serving number ${called}.`);
      }
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
          throw new Error("Number not found.");
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

      const queueRef = doc(db as Firestore, "queues", queueCode);
      const queueSnapshot = await getDoc(queueRef);

      if (!queueSnapshot.exists()) {
        throw new Error("Queue code is invalid.");
      }

      const queueData = queueSnapshot.data() as QueueItem;
      if (!queueData.isOpen) {
        throw new Error("Queue is currently closed.");
      }

      const ticketRef = doc(collection(db as Firestore, "queues", queueCode, "tickets"));

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
          queueId: queueCode,
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

      setClientTicketQueueId(queueCode);
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
    "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-zinc-200 dark:hover:bg-zinc-700";

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
    <div className="mx-auto mt-8 max-w-6xl space-y-6 rounded-xl bg-white/95 p-6 shadow-xl dark:bg-zinc-900/95">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Antrian Management System</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Manage queue creation, queue operations, and client progress in one place.
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
        <div className="grid gap-6 md:grid-cols-2">
          <form onSubmit={handleAuthSubmit} className="space-y-4 rounded-xl border p-4 dark:border-zinc-700">
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
                  <label className="mb-1 block text-sm font-medium">Initial Queue Name (optional)</label>
                  <input
                    type="text"
                    value={queueName}
                    onChange={(event) => setQueueName(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="Main Counter"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Initial Prefix Code (optional)</label>
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
                ? "Already have account? Login"
                : "Need an account? Register"}
            </button>
          </form>

          <div className="space-y-3 rounded-xl border p-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Feature overview</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Create queue accounts and owner login using Firebase Authentication.</li>
              <li>Dashboard with simple queue statistics and quick menu.</li>
              <li>Queue management for create, edit, and delete operations.</li>
              <li>Queue detail actions for open/close queue, next number, and deleting numbers.</li>
              <li>Client interface to register queue numbers and track live progress.</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border p-3 dark:border-zinc-700">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Logged in as <span className="font-semibold">{user.email}</span>
            </p>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                type="button"
                className={`${menuButtonClasses} ${activeMenu === "dashboard" ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
                onClick={() => setActiveMenu("dashboard")}
              >
                Dashboard
              </button>
              <button
                type="button"
                className={`${menuButtonClasses} ${activeMenu === "queues" ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
                onClick={() => setActiveMenu("queues")}
              >
                Queue Management
              </button>
              <button
                type="button"
                className={`${menuButtonClasses} ${activeMenu === "details" ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
                onClick={() => setActiveMenu("details")}
              >
                Queue Details
              </button>
              <button
                type="button"
                className={`${menuButtonClasses} ${activeMenu === "client" ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
                onClick={() => setActiveMenu("client")}
              >
                Client Interface
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-zinc-700 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </div>
          </div>

          {activeMenu === "dashboard" && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Queues</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalQueues}</p>
              </div>
              <div className="rounded-xl border p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Open Queues</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{openQueues}</p>
              </div>
              <div className="rounded-xl border p-4 dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Waiting Numbers</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalWaiting}</p>
              </div>
              <div className="rounded-xl border p-4 dark:border-zinc-700 md:col-span-3">
                <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">Main Menu</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
                    onClick={() => setActiveMenu("queues")}
                  >
                    Manage queues
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
                    onClick={() => setActiveMenu("details")}
                  >
                    Open queue details
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
                    onClick={() => setActiveMenu("client")}
                  >
                    Open client interface
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "queues" && (
            <div className="grid gap-6 md:grid-cols-2">
              <form onSubmit={handleCreateQueue} className="space-y-3 rounded-xl border p-4 dark:border-zinc-700">
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

              <div className="space-y-3 rounded-xl border p-4 dark:border-zinc-700">
                <h3 className="text-lg font-semibold">Queue List</h3>
                {queues.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No queues created yet.</p>
                ) : (
                  <div className="space-y-2">
                    {queues.map((queueItem) => (
                      <div
                        key={queueItem.id}
                        className="rounded-lg border p-3 text-sm dark:border-zinc-700"
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
                              Queue code: <span className="font-mono">{queueItem.id}</span>
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
            <div className="space-y-4 rounded-xl border p-4 dark:border-zinc-700">
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
                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-lg border p-3 dark:border-zinc-700">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Queue code</p>
                      <p className="font-mono text-sm">{selectedQueue.id}</p>
                    </div>
                    <div className="rounded-lg border p-3 dark:border-zinc-700">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Current number</p>
                      <p className="text-xl font-bold">{selectedQueue.currentNumber}</p>
                    </div>
                    <div className="rounded-lg border p-3 dark:border-zinc-700">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Last issued</p>
                      <p className="text-xl font-bold">{selectedQueue.lastIssuedNumber}</p>
                    </div>
                    <div className="rounded-lg border p-3 dark:border-zinc-700">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Waiting</p>
                      <p className="text-xl font-bold">{selectedQueue.waitingCount}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleQueueStatus(true)}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Open Queue
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleQueueStatus(false)}
                      className="rounded-lg bg-zinc-600 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
                    >
                      Close Queue
                    </button>
                    <button
                      type="button"
                      onClick={handleNextNumber}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
                            className="flex items-center justify-between rounded-lg border p-2 text-sm dark:border-zinc-700"
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
            <div className="grid gap-6 md:grid-cols-2">
              <form onSubmit={handleClientRegister} className="space-y-3 rounded-xl border p-4 dark:border-zinc-700">
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
                    placeholder="Paste queue code from owner"
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

              <div className="space-y-3 rounded-xl border p-4 dark:border-zinc-700">
                <h3 className="text-lg font-semibold">Queue Progress</h3>
                {!clientTicketId ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No ticket registered yet.</p>
                ) : (
                  <>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">Queue: {clientTicketQueueName}</p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      Your number: {clientTicketPrefixCode}-{clientTicketNumber}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-lg border p-3 dark:border-zinc-700">
                        <p className="text-zinc-500 dark:text-zinc-400">Current number</p>
                        <p className="text-lg font-semibold">{clientQueueCurrentNumber}</p>
                      </div>
                      <div className="rounded-lg border p-3 dark:border-zinc-700">
                        <p className="text-zinc-500 dark:text-zinc-400">Numbers ahead</p>
                        <p className="text-lg font-semibold">{numbersAhead < 0 ? 0 : numbersAhead}</p>
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
