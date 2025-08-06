import { GetServerSidePropsContext } from "next";
import { updateSonntagsPlaylist } from "../services/database";
import { getLivePunkte } from "../services/retrieveLivePunkte";

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
  const playlist = await getLivePunkte(sonntagsId);

  if(!playlist) {
    return {
      notFound: true,
    }
  }

  await updateSonntagsPlaylist(sonntagsId, playlist)

  return {props: {playlist}}
}