import { GetServerSidePropsContext } from "next";
import { getSonntagById, getTipp, getUserById } from "../../services/database";
import Link from "next/link";
import { SerializableSonntag, User } from "../../types";
import { useState } from "react";
import styles from "./sonntag.module.css";

interface Song {
  artist: string;
  title: string;
}

export default function Overview({sonntag, user, initialBingofeld}: 
  {sonntag: SerializableSonntag, user: User, initialBingofeld: Array<Song>}) {
  const [songInputIndex, setSongInputIndex] = useState<number|null>();
  const [bingofeld, setBingofeld] = useState<Array<Song>>(initialBingofeld);

  const saveTipp = (formData: FormData) => {
    if(typeof songInputIndex === "number") {
      const newTipp = {
        artist: formData.get("artist")?.valueOf() as string || "",
        title: formData.get("title")?.valueOf() as string || "",
      }
      const newBingofeld = [...bingofeld];
      newBingofeld[songInputIndex] = newTipp;
      setBingofeld(newBingofeld);
      setSongInputIndex(null);
      fetch(`/api/user/tipp`, {
        method: "POST",
        body: JSON.stringify({
          userid: user.id,
          sonntag: sonntag.id,
          bingofeld: JSON.stringify(newBingofeld),
        }),
      })
    }
  }

  return <>
    <Link href="/sonntag">Zurück zur Übersicht</Link>
    <h1>{sonntag.name} {songInputIndex}</h1>
    <p>{sonntag.date}</p>
    {typeof songInputIndex === "number" && <>
      <form action={saveTipp}>
        <label>Künstler: <input name="artist" type="text" defaultValue={bingofeld[songInputIndex].artist} /></label><br />
        <label>Lied: <input name="title" type="text" defaultValue={bingofeld[songInputIndex].title} /></label><br />
        <br />
        <div style={{display: "flex", alignContent: "space-between"}}>

        <button style={{marginRight: 32}} type="reset" onClick={() => setSongInputIndex(null)}>schließen</button>
        <button type="submit">Speichern</button>
        </div>
        <br />
        <br />
        </form>
      </>
    }
    <div className={styles.songListe}>
      <div className={styles.songItem} style={{backgroundColor: "transparent", fontWeight: 700, color: "#333"}}>100 - 81</div>
      <div className={styles.songItem} style={{backgroundColor: "transparent", fontWeight: 700, color: "#333"}}>80 - 61</div>
      <div className={styles.songItem} style={{backgroundColor: "transparent", fontWeight: 700, color: "#333"}}>60 - 41</div>
      <div className={styles.songItem} style={{backgroundColor: "transparent", fontWeight: 700, color: "#333"}}>40 - 21</div>
      <div className={styles.songItem} style={{backgroundColor: "transparent", fontWeight: 700, color: "#333"}}>20 - 1</div>
      {bingofeld.map((song, index) => {
        return <div onClick={() => setSongInputIndex(index)} 
          className={styles.songItem} key={`song_${index}`}>{song.artist} - {song.title}</div>
      })}
    </div>
  </>

}

// Serverseitiges Data Fetching mit Zugriff auf den dynamischen Slug
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {slug} = context.params!;
  const { userid } = context.req.cookies;

  if(userid === undefined) {
    return {
      notFound: true,
    }
  }

  const user = await getUserById(userid);
  
  if(slug === undefined || typeof slug !== "string") {
    return {
      notFound: true,
    }
  }

  let initialBingofeld = await getTipp(userid, slug);
  if(!initialBingofeld) {
    initialBingofeld = Array(25).fill({artist: "", title: ""})
  }

  const sonntag = await getSonntagById(slug);

  if (!sonntag || !user || !initialBingofeld) {
    return {
      notFound: true,
    }
  }

  const transferredUser: User = {
    id: user.id,
    gesamtpunktzahl: user.gesamtpunktzahl,
    name: user.name,
  }

  const serializableSonntag: SerializableSonntag = {...sonntag, date: sonntag.date.toLocaleString()}

  return {
    props: {
      sonntag: serializableSonntag,
      user: transferredUser,
      initialBingofeld,
    },
  }
}
