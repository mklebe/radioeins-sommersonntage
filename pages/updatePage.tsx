import { GetServerSidePropsContext } from "next";
import { getAllTipsBySonntag, getSonntagById, updateSonntagsPlaylist, updateUserTippStatus } from "../services/database";
import { Song } from "../types";
import { Container } from "@mui/material";
import { calculatePointsForTipps } from "../services/punktberechnung";

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {sonntagsId} = context.query as unknown as {sonntagsId: string};
  const sonntag = await getSonntagById(sonntagsId)
  if (!sonntag) {
    return {
      notFound: true,
    }
  }
  console.log(`Found: ${sonntagsId}`);
  const playlist = sonntag.playlist;

  if(!playlist) {
    return false;
  }
  console.log("found playlist with" + playlist.length + " entries")
  const rankedSonntagsListe: Array<PlaylistSong>  = playlist.map((s: Song, index: number) => ({
    ...s,
    position: 100 - index,
  }));
  
  updateSonntagsPlaylist(sonntagsId, rankedSonntagsListe);
  const tipps = await getAllTipsBySonntag(sonntagsId)

  tipps.forEach( async (t) => {
    
    const {punktzahl, hits} = calculatePointsForTipps(t, rankedSonntagsListe);
    console.info(`Updated list ${t.id} with ${punktzahl} points`)
    await updateUserTippStatus(t.id, hits, punktzahl);
  });

  return {props: {}};
};
