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

export async function getServerSideProps() {
  const playlist = await getLivePunkte();

  if(!playlist) {
    return {
      notFound: true,
    }
  }

  await updateSonntagsPlaylist("Top100OneLove", playlist)
  console.log(playlist);

  return {props: {playlist}}
}