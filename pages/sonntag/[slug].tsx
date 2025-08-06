import { GetServerSidePropsContext } from "next";
import { getSonntagById, getTipp, getUserById, saveUserTipp } from "../../services/database";
import Link from "next/link";
import { SerializableSonntag, Song, SonntagsTipp, TippStatus, User } from "../../types";
import { FormEvent, useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

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
  return <>
    <Box
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
          let backgroundColor = index === selectedSongIndex ? "#ddd" : tippStatusColorMapping.get(bingofeldHits[index]);
          backgroundColor = index === 4 ? "#FFB7C5" : backgroundColor
        
          return <Paper
          sx={{ backgroundColor, cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 1 }}
          onClick={() => selectSong(index)} key={`song_${index}`}>
              {song.artist} - {song.title}
            </Paper>
          
        })}
      </Box>
      <Typography mt="24px">Der richtige Tipp für die Nummer 1 bringt 10 Punkte extra und kann in dem Feld oben rechts (Rosa Hintergrund) angegeben werden.</Typography>
  </>
}
interface UpdateBingoFeldProps {
  initialSong: Song;
  isWinnerTipp: boolean;
  closeForm: () => void;
  saveSong: (song: Song) => void;
}
function UpdateBingoFeld({initialSong, closeForm, saveSong, isWinnerTipp}: UpdateBingoFeldProps) {
  const [song, setSong] = useState<Song>(initialSong);
  useEffect(() => {
    setSong(initialSong);
  }, [initialSong]);

  const saveTipp = (evt: FormEvent) => {
    evt.preventDefault();
    saveSong(song);
    setSong({
      artist: "",
      title: "",
    })
    closeForm();
  }
  return <form onSubmit={saveTipp}>
          {isWinnerTipp && <Typography>Dein Tipp für die Nummer 1</Typography>}
          <label>Künstler: <input name="artist" type="text" value={song.artist} onChange={(evt) => {
            setSong({
              ...song,
              artist: evt.target.value,
            });
          }} /></label><br />
          <label>Lied: <input name="title" type="text" value={song.title} onChange={(evt) => {
            setSong({
              ...song,
              title: evt.target.value,
            });
          }} /></label><br />
          <br />
          <div style={{display: "flex", alignContent: "space-between"}}>
            <button style={{marginRight: 32}} type="reset" onClick={() => closeForm()}>schließen</button>
            <button type="submit">Speichern</button>
          </div>
          <br />
          <br />
        </form>
}

interface OverviewProps  {
  sonntag: SerializableSonntag;
  user: User;
  tipp: SonntagsTipp;
  isLocked: boolean;
}
export default function Overview({sonntag, user, tipp, isLocked}: OverviewProps ) {
  const [songInputIndex, setSongInputIndex] = useState<number|null>(null);
  const [bingofeld, setBingofeld] = useState<Array<Song>>(tipp.bingofeld);

  const saveTipp = (song: Song) => {
    if(typeof songInputIndex === "number") {
      const newBingofeld = [...bingofeld];
      newBingofeld[songInputIndex] = song;
      setBingofeld(newBingofeld);
      saveUserTipp(user.id, sonntag.id, newBingofeld);
    }
  }

  return <>
    <Link href="/sonntag">Zurück zur Übersicht</Link>
    <Typography variant="h4">{sonntag.name}</Typography>
    <Typography mb="24px">Um alle Felder auszufüllen brauchst du noch {bingofeld.filter(a => a.artist === "").length} Songs</Typography>
    {!isLocked && typeof songInputIndex === "number" &&
        <UpdateBingoFeld 
          isWinnerTipp={songInputIndex === 4}
          closeForm={() => setSongInputIndex(null)}
          initialSong={bingofeld[songInputIndex]}
          saveSong={saveTipp}
        />
    }
    <Bingofeld bingofeld={bingofeld} selectSong={(index) => {setSongInputIndex(index)}} selectedSongIndex={songInputIndex} bingofeldHits={tipp.tippStatus} />
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
      isLocked: sonntag.date.getTime() < new Date().getTime()
    },
  }
}
