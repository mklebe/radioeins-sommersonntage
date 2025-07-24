import { FirebaseOptions, initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { Sonntag, User } from "../types";

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

export const getSonntage = async (): Promise<Array<Sonntag>> => {
  const querySnapshot = await getDocs(collection(db, "sonntag"));

  return querySnapshot.docs.map((document) => ({
    id: document.id,
    date: new Date(document.data().date.seconds * 1000),
    name: document.data().name,
    playlist: document.data().playlist,
  }));
}

export const saveUserTipp = async (userid: string, sonntag: string, bingofeld: Array<string>) => {
  const docReference = doc(db, "tipps", `${userid}_${sonntag}`);
  await setDoc(docReference, {bingofeld});
}

export const getTipp = async (userid: string, sonntag: string) => {
  const tipId = `${userid}_${sonntag}`;
  const docReference = doc(db, "tipps", tipId);
  const docSnapshot = await getDoc(docReference);

  if(docSnapshot.exists()) {
    return docSnapshot.data().bingofeld;
  }

  return null;
}

export const getSonntagById = async (documentId: string): Promise<Sonntag|null> => {
  const docReference = doc(db, "sonntag", documentId);
  const docSnapshot = await getDoc(docReference);

  if(docSnapshot.exists()) {
    return {
      id: docSnapshot.id,
      date: new Date(docSnapshot.data().date.seconds * 1000),
      name: docSnapshot.data().name,
      playlist: docSnapshot.data().playlist,
    }
  }

  return null;
}

export const getUserById = async (documentId: string): Promise<User|null> => {
  const docReference = doc(db, "user", documentId);
  const docSnapshot = await getDoc(docReference);    
  
  if(docSnapshot.exists()) {
    const a = {
      id: docSnapshot.id,
      gesamtpunktzahl: docSnapshot.data().gesamtpunktzahl,
      name: docSnapshot.data().name,
    }

    return a;
  }

  return null;
}