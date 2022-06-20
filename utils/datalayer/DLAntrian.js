
import {
    collection,
    updateDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    getFirestore,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    addDoc,
    orderBy,
    limit
} from "firebase/firestore";
import guid from "guid";

// Antrian attribute
// name: name
// company: company
// publicAccess: string
// prefixCode: string
// createdBy: user.id
// accessCode: string
// status: int

async function getListAntrian(uid) {
    const db = getFirestore();
    const q = query(collection(db, "antrian"), where("createdBy", "==", uid));
    const querySnapshot = await getDocs(q);
    var snapshotAntrian = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        snapshotAntrian.push({
            'id': doc.id,
            'data': doc.data()
        })
    });

    return snapshotAntrian
}
async function getListTicket(uid) {

    const db = getFirestore();
    const q = query(collection(db, "pengantri"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    var snapshotTicket = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        snapshotTicket.push({
            'id': doc.id,
            'data': doc.data()
        })
    });
    console.log("snapshotTicket")

    console.log(snapshotTicket)

    return snapshotTicket
}

async function insertToFirestore(data) {
    const db = getFirestore()
    const docRef = await addDoc(collection(db, "antrian"), data);

    if (data.status == 1){
        await openAntrian(docRef.id)
    }
    return docRef.id;
}

async function getAntrian(aid) {
    const db = getFirestore();
    const docRef = doc(db, "antrian", aid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    }
    return null

}
async function getAntrianSubcribtion(aid, onChange) {
    const db = getFirestore();
    const unSub = onSnapshot(doc(db, "antrian", aid), (doc) => {
        onChange(doc)
    });
    return unSub
}

async function updateAntrian(aid, map, value) {
    const db = getFirestore();

    const docRef = doc(db, "antrian", aid);

    var updateDict = {
        updateTime: serverTimestamp()
    }
    updateDict[map] = value
    // Update the timestamp field with the value from the server
    await updateDoc(docRef, updateDict);
}

async function openAntrian(aid) {
    const db = getFirestore();

    const docRef = doc(db, "antrian", aid);

    var updateDict = {
        status: 1,
        accessCode: guid.create().value,
        startedTime: serverTimestamp(),
        updateTime: serverTimestamp()
    }
    // Update the timestamp field with the value from the server
    await updateDoc(docRef, updateDict);
}

async function closeAntrian(aid) {
    const db = getFirestore();

    const docRef = doc(db, "antrian", aid);

    var updateDict = {
        status: 0,
        accessCode: null,
        stopedTime: serverTimestamp(),
        updateTime: serverTimestamp()
    }
    // Update the timestamp field with the value from the server
    await updateDoc(docRef, updateDict);
}


async function getAcccesAntrian(sacc) {
    var snapshotAntrian = {
        'status': -1,
        'message': null, // default or have an issue
        'data': null,
        'id': null
    }
    const aid = sacc.substring(0, 20);
    const acc = sacc.substring(20);

    const db = getFirestore();
    const docRef = doc(db, "antrian", aid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        snapshotAntrian['id'] = docSnap.id,
            snapshotAntrian['data'] = docSnap.data()
        if (snapshotAntrian.data.accessCode && snapshotAntrian.data.accessCode == acc) {
            snapshotAntrian['status'] = 10 // Allowed
        } else {
            snapshotAntrian['status'] = 12 // Un Allowed
        }
    } else {
        snapshotAntrian['status'] = 13 // Document not found
    }
    return snapshotAntrian
}

async function getWaitingList(aid) {
    const db = getFirestore();
    const waitingRef = collection(db, "antrian", aid, "waitingList");
    const q = query(waitingRef, orderBy("joined"), limit(4))
    const querySnapshot = await getDocs(q);
    var snapshotAntrian = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        snapshotAntrian.push({
            'id': doc.id,
            'data': doc.data()
        })
    });

    return snapshotAntrian
}

async function getWaitingListSubscription(aid, onSnap) {
    const db = getFirestore();
    const antRef = doc(db, "antrian", aid)
    const waitingRef = collection(db, "pengantri");
    const q = query(waitingRef, where('antrian', '==', antRef), limit(5))
    const unsubscribe = onSnapshot(q, onSnap);
    return unsubscribe
}

async function getActiveList(aid) {
    const db = getFirestore();
    const waitingRef = collection(db, "antrian", aid, "activeList");
    const q = query(waitingRef, orderBy("joined"), limit(4))
    const querySnapshot = await getDocs(q);
    var snapshotAntrian = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        snapshotAntrian.push({
            'id': doc.id,
            'data': doc.data()
        })
    });

    return snapshotAntrian
}

async function getPassedList(aid) {
    const db = getFirestore();
    const waitingRef = collection(db, "antrian", aid, "passedList");
    const q = query(waitingRef, orderBy("joined"), limit(4))
    const querySnapshot = await getDocs(q);
    var snapshotAntrian = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        snapshotAntrian.push({
            'id': doc.id,
            'data': doc.data()
        })
    });

    return snapshotAntrian
}

async function submitAcccesAntrian(sacc, prefixCode, displayName, userInfo) {
    const aid = sacc.substring(0, 20);
    const acc = sacc.substring(20);

    const db = getFirestore();
    const antrianRef = doc(db, "antrian", aid)

    const antSnap = await getDoc(antrianRef);

    var lastNumber = 1

    const postPengantri = {
        uid: userInfo.id,
        displayName: displayName,
        userEmail: userInfo.email,
        photoURL: userInfo.photoURL,
        antName: null,
        codeAnt: null,
        joined: serverTimestamp(),
        antrian: antrianRef,
        status: 0,// manunggu
        sacc: sacc
    };

    if (antSnap.exists()) {
        var dTemp = antSnap.data()
        postPengantri.antName = dTemp.name
        console.log(dTemp)
        if (dTemp.counter) {
            lastNumber = dTemp.counter.number + 1
        }
    }

    const codeRecieved = prefixCode + '-' + ((lastNumber + 10000000) + '').substring(2)
    
    postPengantri['codeAnt'] = codeRecieved

    // await setDoc(clientRef, newDataUser);
    await addDoc(collection(db, "pengantri"), postPengantri);

    await updateDoc(antrianRef, {
        counter: {
            number: lastNumber,
            lastuid: userInfo.id
        }
    });


    return 0
}


export {
    getListAntrian,
    insertToFirestore,
    getAntrian,
    getAntrianSubcribtion,
    updateAntrian,
    openAntrian,
    closeAntrian,
    getAcccesAntrian,
    submitAcccesAntrian,
    getWaitingList,
    getActiveList,
    getPassedList,
    getWaitingListSubscription,
    getListTicket
}