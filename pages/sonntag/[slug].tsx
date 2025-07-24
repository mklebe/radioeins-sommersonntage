import { GetServerSidePropsContext } from "next";
import { getSonntagById, getTipp, getUserById } from "../../services/database";
import Link from "next/link";
import { SerializableSonntag, Song, Tipp, TippStatus, User } from "../../types";
import { useState } from "react";
import { Box, List, ListItem, Paper } from "@mui/material";

const tippStatusColorMapping = new Map<TippStatus, string>();
tippStatusColorMapping.set(TippStatus.NOT_HIT, "transparent");
tippStatusColorMapping.set(TippStatus.IN_LIST, "yellow");
tippStatusColorMapping.set(TippStatus.CORRECT_COLUMN, "green");
tippStatusColorMapping.set(TippStatus.CORRECT_WINNER, "red");
tippStatusColorMapping.set(TippStatus.JOKER, "rebeccapurple");


type BingofeldProps = {
  bingofeld: Array<Song>,
  selectedSongIndex: number | null,
  bingofeldHits: Array<TippStatus>
  selectSong: (index: number) => void,
}
function Bingofeld({bingofeld, selectSong, selectedSongIndex, bingofeldHits}: BingofeldProps) {
  return <Box
      display="grid"
      gridTemplateColumns="repeat(5, 1fr)"
      gridTemplateRows="repeat(5, 1fr)"
      gap={2}
    >
      <div>100 - 81</div>
      <div>80 - 61</div>
      <div>60 - 41</div>
      <div>40 - 21</div>
      <div>20 - 1</div>
      {bingofeld.map((song, index) => {
        const backgroundColor = index === selectedSongIndex ? "#ddd" : tippStatusColorMapping.get(bingofeldHits[index]);
       
        return <Paper
         sx={{ backgroundColor, cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 1 }}
         onClick={() => selectSong(index)} key={`song_${index}`}>
            {song.artist} - {song.title}
          </Paper>
        
      })}
    </Box>
}

type PlaylistProps = {
  list: Array<Song>,
}
function Playlist({list}: PlaylistProps) {
  return <List>
      {list.map(({artist, title}, index) => {
        return <ListItem key={`${title}_${index}`}>{100 - index} {artist} - {title}</ListItem>
      })}
    </List>
}

export default function Overview({sonntag, user, tipp}: 
  {sonntag: SerializableSonntag, user: User, tipp: Tipp} ) {
  const [songInputIndex, setSongInputIndex] = useState<number|null>(null);
  const [bingofeld, setBingofeld] = useState<Array<Song>>(tipp.bingofeld);

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
    <h1>{sonntag.name}</h1>
    <p>Playlist startet: {sonntag.date}</p>
    <p>Tipps von: {user.name}</p>
    <p>Punkte für diese List: {tipp.punktzahl}</p>
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
    <Bingofeld bingofeld={bingofeld} selectSong={(index) => setSongInputIndex(index)} selectedSongIndex={songInputIndex} bingofeldHits={tipp.tippStatus} />
    <Playlist list={sonntag.playlist} />
  </>

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {slug} = context.params!;
  const { userid } = context.req.cookies;

  if(userid === undefined) {
    return {
      notFound: true,
    }
  }
  if(slug === undefined || typeof slug !== "string") {
    return {
      notFound: true,
    }
  }

  const [user, tipp, sonntag] = await Promise.all([getUserById(userid), getTipp(userid, slug), getSonntagById(slug)]);
  console.log(user, tipp, sonntag);

  if (!sonntag || !user || !tipp) {
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
      tipp,
    },
  }
}
