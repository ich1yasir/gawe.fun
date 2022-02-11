
import { collection, updateDoc, serverTimestamp, query, where, getDocs, getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";
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
    const unSub = onSnapshot(doc(db,  "antrian", aid), (doc) => {
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
        progress: {
            waitingList: [],
            passedList: [],
            active: [],
            number: 1,
        },
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

export { getListAntrian, getAntrian, getAntrianSubcribtion, updateAntrian, openAntrian, closeAntrian }