import { initializeApp } from "firebase/app";

export default function Home() {
  return (
    <div>
      <h1>It work's</h1>
    </div>
  );
}

const firebaseConfig = {
  apiKey: "AIzaSyDj_zOb2e7ZrRYFIdb-kYRv_LdANyyaq20",
  authDomain: "sommersonntage-tipps.firebaseapp.com",
  projectId: "sommersonntage-tipps",
  storageBucket: "sommersonntage-tipps.firebasestorage.app",
  messagingSenderId: "686848289269",
  appId: "1:686848289269:web:9c2832ce18f79bc07598bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);