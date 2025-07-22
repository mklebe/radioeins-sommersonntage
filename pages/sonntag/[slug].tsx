import { GetServerSidePropsContext } from "next";
import { getSonntagById, getUserById, saveUserTipp } from "../../services/database";
import Link from "next/link";
import { SerializableSonntag, Tipp, User } from "../../types";
import { useState } from "react";
import styles from "./sonntag.module.css";

type TippUser = Omit<User, "tipps"> & {"tipp": Tipp}

export default function Overview({sonntag, user}: {sonntag: SerializableSonntag, user: TippUser}) {
  const [songInputIndex, setSongInputIndex] = useState<number|null>();
  const [bingofeld, setBingofeld] = useState<Array<string>>(user.tipp.bingofeld);

  const saveTipp = (formData: FormData) => {
    if(songInputIndex) {
      const newTipp = `${formData.get("artist")} - ${formData.get("song")}`
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
    <p>Tipppunkte: {user.tipp.punktzahl}</p>
    {songInputIndex && <>
    <form action={saveTipp}>
      <label>Künstler: <input name="artist" type="text" /></label>
      <label>Lied: <input name="song" type="text" /></label>
      <button type="submit">Speichern</button>

      <button type="reset" onClick={() => setSongInputIndex(null)}>schließen</button>
      </form>
    </>
    }
    <div className={styles.songListe}>
      {bingofeld.map((song, index) => {
        return <div onClick={() => setSongInputIndex(index)} className={styles.songItem} key={`song_${index}`}>{song}</div>
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
  console.log(user);
  
  if(slug === undefined || typeof slug !== "string") {
    return {
      notFound: true,
    }
  }

  const sonntag = await getSonntagById(slug);

  if (!sonntag || !user) {
    return {
      notFound: true,
    }
  }

  const transferredTipp: Tipp = user.tipps.find((t) => t.sonntag === sonntag.id) || {
    sonntag: sonntag.id,
    punktzahl: 0,
    bingofeld: Array(25).fill(""),
  }

  const transferredUser: TippUser = {
    id: user.id,
    gesamtpunktzahl: user.gesamtpunktzahl,
    name: user.name,
    tipp: transferredTipp,
  }

  const serializableSonntag: SerializableSonntag = {...sonntag, date: sonntag.date.toLocaleString()}

  return {
    props: {
      sonntag: serializableSonntag,
      user: transferredUser,
    },
  }
}
