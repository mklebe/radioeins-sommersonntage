import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { Song, Sonntag, SonntagsTipp, Tipp, TippStatus, User } from "../types";
import { PlaylistSong } from "../pages/updatePage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Initialize Firebase
console.log(`Initializes app: ${getApps().length}`)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getSonntage = async (): Promise<Array<Sonntag>> => {
  const querySnapshot = await getDocs(collection(db, "sonntag"));

  return querySnapshot.docs.map((document) => ({
    id: document.id,
    date: new Date(document.data().date.seconds * 1000),
    name: document.data().name,
    playlist: document.data().playlist ||[],
  }));
}

export const updateUserTippStatus = async (tippId: string, tippStatus: Array<TippStatus>, punktzahl: number) => {
  const docReference = doc(db, "tipps", tippId);
  return setDoc(docReference, {tippStatus, punktzahl}, {merge: true});
}

export const saveUserTipp = async (userid: string, sonntag: string, bingofeld: Array<Song>) => {
  const docReference = doc(db, "tipps", `${userid}_${sonntag}`);
  console.log(userid, sonntag, bingofeld)
  await setDoc(docReference, {bingofeld, tippStatus: Array(25).fill(TippStatus.NOT_HIT)}, { merge: true })
    .then(() => console.log("Successfully updated", userid, sonntag))
    .catch((e) => console.log(e));
}

export const getTipp = async (userid: string, sonntag: string): Promise<Tipp> => {
  const tipId = `${userid}_${sonntag}`;
  const docReference = doc(db, "tipps", tipId);
  const docSnapshot = await getDoc(docReference);

  if(docSnapshot.exists()) {
    return {
      bingofeld: docSnapshot.data().bingofeld || Array(25).fill({artist: "", title: ""}),
      punktzahl: docSnapshot.data().punktzahl || 0,
      tippStatus: docSnapshot.data().tippStatus || Array(25).fill(TippStatus.NOT_HIT),
    };
  }

  return { 
    bingofeld: Array(25).fill({artist: "", title: ""}),
    punktzahl: 0,
    tippStatus: Array(25).fill(TippStatus.NOT_HIT),
  };
}

export const getAllTipsBySonntag = async (sonntag: string): Promise<Array<SonntagsTipp>> => {
  const tippsSnapshots = await getDocs(collection(db, "tipps"));
  const sonntagsTipps = tippsSnapshots.docs
    .filter((ts) => ts.id.includes(sonntag))
    .map((doc) => {
      const joker = +doc.data().joker
      return {
        id: doc.id,
        bingofeld: doc.data().bingofeld,
        joker,
        tippStatus: doc.data().tippStatus,
        punktzahl: +doc.data().punktzahl,
      }
    });
    return sonntagsTipps;
}

export const updateSonntagsPlaylist = async (documentId: string, playlist: Array<PlaylistSong>) => {
  const docReference = doc(db, "sonntag", documentId);
  await setDoc(docReference, {playlist}, {merge: true});
}

export const getSonntagById = async (documentId: string): Promise<Sonntag|null> => {
  const docReference = doc(db, "sonntag", documentId);
  const docSnapshot = await getDoc(docReference);

  if(docSnapshot.exists()) {
    return {
      id: docSnapshot.id,
      date: new Date(docSnapshot.data().date.seconds * 1000),
      name: docSnapshot.data().name,
      playlist: docSnapshot.data().playlist || [],
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