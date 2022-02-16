
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

async function insertToFirestore(uid, data, isStart = false) {
    if (isStart){
        data['accessCode'] = guid.create().value
    }
    const db = getFirestore()
    const docRef = await addDoc(collection(db, "antrian"), data);
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
    const q = query(waitingRef, orderBy("joined", "desc"), limit(4))
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
async function getActiveList(aid) {
    const db = getFirestore();
    const waitingRef = collection(db, "antrian", aid, "activeList");
    const q = query(waitingRef, orderBy("joined", "desc"), limit(4))
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
    const q = query(waitingRef, orderBy("joined", "desc"), limit(4))
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
    const antRef = doc(db, "antrian", aid)
    const clientRef = doc(db, "antrian", aid, "waitingList", userInfo.id)
    const clientSnap = await getDoc(clientRef);
    const antSnap = await getDoc(antRef);

    var lastNumber = 1

    const newDataUser = {
        DisplayName: displayName,
        photoURL: userInfo.photoURL,
        uid: userInfo.id,
        userEmail: userInfo.email,
        codeAnt: null,
        joined: serverTimestamp(),
        status: 0,// manunggu
        number: lastNumber
    }

    const postAct = {
        uid: userInfo.id,
        displayName: displayName,
        antName: null,
        codeAnt: null,
        antrian: antRef,
        status: 0,// manunggu
        inAList: clientRef,
        sacc: sacc
    };

    if (antSnap.exists()) {
        var dTemp = antSnap.data()
        postAct.antName = dTemp.name
        console.log(dTemp)
        if (dTemp.counter) {
            lastNumber = dTemp.counter.number + 1
        }
        newDataUser['number'] = lastNumber
    }

    const codeRecieved = prefixCode + '-' + ((lastNumber + 10000000) + '').substring(2)
    newDataUser['codeAnt'] = codeRecieved
    postAct['codeAnt'] = codeRecieved


    if (clientSnap.exists()) {
        return -1
    }

    await updateDoc(antRef, {
        counter: {
            number: lastNumber,
            lastuid: userInfo.id
        }
    });

    await setDoc(clientRef, newDataUser);
    await addDoc(collection(db, "pengantri"), postAct);
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
    getPassedList
}