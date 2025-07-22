import { FirebaseOptions, initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

export interface Sonntag {
    id: string;
    name: string;
    date: Date;
}
export const getSonntage = async (): Promise<Array<Sonntag>> => {
    const querySnapshot = await getDocs(collection(db, "sonntag"));

    return querySnapshot.docs.map((document) => ({
        id: document.id,
        date: new Date(document.data().date.seconds * 1000),
        name: document.data().name,
    }));
}

export const getSonntagById = async (documentId: string): Promise<Sonntag|null> => {
    const docReference = doc(db, "sonntag", documentId);
    const docSnapshot = await getDoc(docReference);

    if(docSnapshot.exists()) {
        return {
            id: docSnapshot.id,
            date: new Date(docSnapshot.data().date.seconds * 1000),
            name: docSnapshot.data().name,
        }
    }

    return null;
}