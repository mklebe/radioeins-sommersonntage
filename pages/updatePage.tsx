import { GetServerSidePropsContext } from "next";
import { getSonntagById, getTipp, updateUserTippStatus } from "../services/database";
import { TippStatus } from "../types";
import { Container, Typography } from "@mui/material";

export default function UpdatePage({punktzahl}: {punktzahl: number}) {
  return <Container>
      <Typography>Great Success, never saw a better update!</Typography>
      <Typography>New Points {punktzahl}</Typography>
    </Container>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userId = "1";
  const sonntagsId = "Top100TestSonntage";
  const tippId = `${userId}_${sonntagsId}`;

  const [tipp, sonntag] = await Promise.all([getTipp(userId, sonntagsId), getSonntagById(sonntagsId)]);

  const tippStatus = tipp.tippStatus || Array(25).fill(TippStatus.IN_LIST)
  let punktzahl = calculatePositionPointsForTipps(tippStatus);
  punktzahl += calculateBingoPoints(tippStatus);
  punktzahl += calculatePointsForCorrectWinner(tippStatus);
  updateUserTippStatus(tippId, tippStatus, punktzahl);
  return {props: {punktzahl}};
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