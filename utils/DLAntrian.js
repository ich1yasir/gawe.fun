
import { collection, query, where, getDocs, getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";

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
    const unsub = onSnapshot(doc(db, "antrian", aid), onChange);
    return unsub
}


export { getListAntrian, getAntrian, getAntrianSubcribtion }