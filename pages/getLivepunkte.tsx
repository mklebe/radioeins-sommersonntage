import { GetServerSidePropsContext } from "next";
import { getSonntagById, updateSonntagsPlaylist } from "../services/database";
import { getFinalPunkte, getLivePunkte } from "../services/retrieveLivePunkte";
import { PlaylistSong } from "./updatePage";

interface PlaylistItem {
  artist: string;
  title: string;
  position: number;
}

export default function GetLivePunkte({playlist}: {playlist: Array<PlaylistItem>}) {
  return <ul>
    {playlist.map(({artist, position, title}, index) => {
      return <li key={index}>{position}. {artist} - {title}</li>
    })}
  </ul>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {sonntagsId} = context.query as unknown as {sonntagsId: string};
  const sonntagFromDatabase = await getSonntagById(sonntagsId);
  const currentHour = new Date().getHours();
  
  let playlist: Array<PlaylistSong>;
  if(sonntagFromDatabase && sonntagFromDatabase.playlist.length === 100) {
    playlist = sonntagFromDatabase.playlist;
  } else if( currentHour >= 19 ) {
    playlist = await getFinalPunkte(sonntagsId);
  } else {
    const playlistFromCrawler = await getLivePunkte(sonntagsId);
    if(!playlistFromCrawler) {
      return {
        notFound: true,
      }
    }
    playlist = playlistFromCrawler;
  }


  await updateSonntagsPlaylist(sonntagsId, playlist)

  return {props: {playlist}}
}