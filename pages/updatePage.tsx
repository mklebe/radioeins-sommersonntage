import { GetServerSidePropsContext } from "next";
import { getAllTipsBySonntag, getSonntagById, getTipp, updateSonntagsPlaylist, updateUserTippStatus } from "../services/database";
import { Song, TippStatus } from "../types";
import { Container } from "@mui/material";
import Fuse from 'fuse.js';
import { Top100OneLove } from "../sonntag";
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

interface UpdateProps {
  punktzahl: number;
  headlines: Array<string>,
}


export default function UpdatePage({punktzahl, headlines }: UpdateProps) {
  return <Container>
      {/* <Typography>Great Success, never saw a better update!</Typography>
      <Typography>New Points {punktzahl}</Typography>
      {playlist.map(ts => <Typography key={ts.time}>{ts.time} : {ts.artist} - {ts.title}</Typography>)} */}
    </Container>
}

export interface PlaylistSong extends Song {
  position: number;
}

const SONNTAGS_ID = "Top100OneLove"

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const sonntag = await getSonntagById("Top100TestSonntage")
  // if (!sonntag) {
  //   return {
  //     notFound: true,
  //   }
  // }
  const playlist = Top100OneLove;

  if(!playlist) {
    return false;
  }
  const rankedSonntagsListe: Array<PlaylistSong>  = playlist.map((s: Song, index: number) => ({
    ...s,
    position: 100 - index,
  }));
  
  updateSonntagsPlaylist(SONNTAGS_ID, rankedSonntagsListe);
  const tipps = await getAllTipsBySonntag(SONNTAGS_ID)
  console.log(tipps)

  tipps.forEach( async (t) => {
    const hitsForField = retrieveHitsForBingofeld(t.bingofeld, rankedSonntagsListe);
    let punktzahl = calculatePositionPointsForTipps(hitsForField);
    punktzahl += calculateBingoPoints(hitsForField);
    punktzahl += calculatePointsForCorrectWinner(hitsForField);
    console.info(`Updated list ${t.id} with ${punktzahl} points`)
    await updateUserTippStatus(t.id, hitsForField, punktzahl);
  });



  return {props: {}};
};

const setUpSearchIndicies = (sonntagsPlaylist : Array<PlaylistSong>) => {
  const fuseConfig = {shouldSort: true,
    threshold: 0.25,
    includeScore: true,
  };
  const artistIndex = new Fuse(sonntagsPlaylist, {
    ...fuseConfig,
    keys: ["artist"]
  });
  const titleIndex = new Fuse(sonntagsPlaylist, {
    ...fuseConfig,
    keys: ["title"]
  });
  return {artistIndex, titleIndex};
} 

const retrieveHitsForBingofeld = (bingofeld: Array<Song>, sonntagsPlaylist: Array<PlaylistSong>) => {
  const hitsForField: Array<TippStatus> = [];
  const {artistIndex, titleIndex} = setUpSearchIndicies(sonntagsPlaylist)
  bingofeld.forEach((song, index) => {
    const artistHits = artistIndex.search(song.artist).map(item => item.item);
    if (!artistHits) {
      hitsForField[index] = TippStatus.NOT_HIT;
      return;
    }
    const titleHits = titleIndex.search(song.title).map(item => item.item);
    if(!titleHits) {
      hitsForField[index] = TippStatus.NOT_HIT;
      return;
    }
    const hit = artistHits.filter((value) => titleHits.includes(value))[0]
    if(!hit) {
      hitsForField[index] = TippStatus.NOT_HIT;
      return;
    }

    hitsForField[index] = TippStatus.IN_LIST;
  });

  return hitsForField;
}; 

const pointsPerHit = new Map<TippStatus, number>();
pointsPerHit.set(TippStatus.NOT_HIT, 0);
pointsPerHit.set(TippStatus.IN_LIST, 1);
pointsPerHit.set(TippStatus.CORRECT_COLUMN, 3);
pointsPerHit.set(TippStatus.CORRECT_WINNER, 3);
pointsPerHit.set(TippStatus.JOKER, 0)

const calculatePositionPointsForTipps = (tipps: Array<TippStatus>): number => {
  return tipps.reduce((acc, current) => acc + pointsPerHit.get(current)!);
}

const calculateBingoPoints = (tipps: Array<TippStatus>): number => {
  let result = 0;
  const fieldOfHits = tipps.map((s) => s === TippStatus.NOT_HIT ? 0 : 1 )
  for(let i = 0; i < 5; i++) {
    const sumOfCulumn = fieldOfHits[i] + fieldOfHits[i+5] + fieldOfHits[i+10] + fieldOfHits[i+15] + fieldOfHits[i+20];
    if (sumOfCulumn === 5) {
      result += 10;
    }
    const sumOfRow = fieldOfHits[i*5] + fieldOfHits[i*5+1] + fieldOfHits[i*5+2] + fieldOfHits[i*5+3] + fieldOfHits[i*5+4];
    if(sumOfRow === 5) {
      result += 10;
    }
  }
  const sumOfFirstDiagonal = fieldOfHits[0] + fieldOfHits[6] + fieldOfHits[12] + fieldOfHits[18] + fieldOfHits[24];
  if(sumOfFirstDiagonal === 5) {
    result += 10;
  }
  const sumOfAntoginstDiagonals = fieldOfHits[4] + fieldOfHits[8] + fieldOfHits[12] + fieldOfHits[16] + fieldOfHits[20];
  if(sumOfAntoginstDiagonals === 5) {
    result += 10;
  }
  return result;
}

const calculatePointsForCorrectWinner = (tipps: Array<TippStatus>):number => {
  if (tipps.includes(TippStatus.CORRECT_WINNER)) {
    return 10;
  }
  return 0;
}