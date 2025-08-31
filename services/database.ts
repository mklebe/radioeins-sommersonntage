import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { Song, Sonntag, SonntagsTipp, TippStatus, User } from "../types";
import { PlaylistSong } from "../pages/updatePage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log(`Initializes app: ${getApps().length}`)

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getSonntage = async (): Promise<Array<Sonntag>> => {
  const querySnapshot = await getDocs(collection(db, "sonntag"));

  if (querySnapshot.docs.length < 1) {
    console.warn(`Could not retrieve sonntage`);
    throw new Error("Could not retrieve sonntage from database")
  }

  return querySnapshot.docs.map((document) => (cleanSonntagWhenNeeded({
    id: document.id,
    date: new Date(document.data().date.seconds * 1000),
    name: document.data().name,
    playlist: document.data().playlist,
  })));
}

export const updateUserTippStatus = async (tippId: string, tippStatus: Array<TippStatus>, punktzahl: number) => {
  const docReference = doc(db, "tipps", tippId);
  return setDoc(docReference, {tippStatus, punktzahl}, {merge: true});
}

export const saveJoker = async (userid: string, sonntag: string, joker: number, tippStatus: Array<TippStatus>, punktzahl: number) => {
  const docReference = doc(db, "tipps", `${userid}_${sonntag}`);
  await setDoc(docReference, {joker, tippStatus, punktzahl}, {merge: true});
  console.log("Saved Joker at:" + joker)
}

export const saveUserTipp = async (userid: string, sonntag: string, bingofeld: Array<Song>) => {
  const docReference = doc(db, "tipps", `${userid}_${sonntag}`);
  console.log(userid, sonntag, bingofeld)
  await setDoc(docReference, {bingofeld, tippStatus: Array(25).fill(TippStatus.NOT_HIT)}, { merge: true })
    .then(() => console.log("Successfully updated", userid, sonntag))
    .catch((e) => console.log(e));
}

export const getTipp = async (userid: string, sonntag: string): Promise<SonntagsTipp> => {
  const tipId = `${userid}_${sonntag}`;
  const docReference = doc(db, "tipps", tipId);
  const docSnapshot = await getDoc(docReference);

  if(docSnapshot.exists()) {
    return cleanSonntagsTippWhenNeeded({
      bingofeld: docSnapshot.data().bingofeld,
      punktzahl: docSnapshot.data().punktzahl,
      tippStatus: docSnapshot.data().tippStatus,
    });
  } else {
    console.info(`Could not retrieve tipps with id ${tipId}, create a new one.`)
    return cleanSonntagsTippWhenNeeded({});
  }
  
}

export const getAllTipsBySonntag = async (sonntag: string): Promise<Array<SonntagsTipp>> => {
  const tippsSnapshots = await getDocs(collection(db, "tipps"));
  const sonntagsTipps = tippsSnapshots.docs
    .filter((ts) => ts.id.includes(sonntag))
    .map((doc) => {
      const joker = +doc.data().joker
      return cleanSonntagsTippWhenNeeded({
        id: doc.id,
        bingofeld: doc.data().bingofeld,
        joker,
        tippStatus: doc.data().tippStatus,
        punktzahl: +doc.data().punktzahl,
      })
    });
    return sonntagsTipps;
}

export const updateSonntagsPlaylist = async (documentId: string, playlist: Array<PlaylistSong>) => {
  const docReference = doc(db, "sonntag", documentId);
  console.log(`Updated ${documentId} with latest Song: ${playlist[0].artist}`)
  await setDoc(docReference, {playlist}, {merge: true});
}

export const getSonntagById = async (documentId: string): Promise<Sonntag|null> => {
  const docReference = doc(db, "sonntag", documentId);
  const docSnapshot = await getDoc(docReference);

  if(docSnapshot.exists()) {
    return cleanSonntagWhenNeeded({
      id: docSnapshot.id,
      date: new Date(docSnapshot.data().date.seconds * 1000),
      name: docSnapshot.data().name,
      playlist: docSnapshot.data().playlist,
    })
  }

  return null;
}

export const getUserById = async (documentId: string): Promise<User|null> => {
  const docReference = doc(db, "user", documentId);
  const docSnapshot = await getDoc(docReference);    
  
  if(docSnapshot.exists()) {
    return cleanUserWhenNeeded({
      id: docSnapshot.id,
      gesamtpunktzahl: docSnapshot.data().gesamtpunktzahl,
      name: docSnapshot.data().name,
    });
  }

  return null;
}

const cleanUserWhenNeeded = ({gesamtpunktzahl, id, name}: Partial<User>): User => {
  return {
    id: id || "",
    gesamtpunktzahl: gesamtpunktzahl || 0,
    name: name || "Unbekannter Nutzer",
  }
}

const cleanSonntagWhenNeeded = ({date, id, name, playlist}: Partial<Sonntag>) : Sonntag => {
  return {
    playlist: playlist || [],
    name: name || "Top 100 Unbekannten Songs",
    date: date || new Date(),
    id: id || "Top100Unknown"
  }
}

const cleanSonntagsTippWhenNeeded = ({bingofeld, id, joker, punktzahl, tippStatus}: Partial<SonntagsTipp>): SonntagsTipp => {
  return {
    bingofeld: bingofeld || Array(25).fill({artist: "", title: ""}),
    joker: joker || null,
    id: id || "Unknown Tipp",
    punktzahl: punktzahl || 0,
    tippStatus: tippStatus || Array(25).fill(TippStatus.NOT_HIT),
  }
}