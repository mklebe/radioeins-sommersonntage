import { initializeApp } from "firebase/app";

export default function Home() {
  return (
    <div>
      <h1>It work's</h1>
    </div>
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);