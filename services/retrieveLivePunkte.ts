import { PlaylistSong } from "../pages/updatePage";
import { Song } from "../types";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const sonntagStart = new Date();
sonntagStart.setHours(9);
sonntagStart.setMinutes(0);


interface TimedSong extends Song {
  time: Date;
}

const extractSongsFromHtml = (htmlString: string) => {
  const dom = new JSDOM(htmlString);

  const rawSongs: Array<TimedSong> = Array.from(
    dom.window.document.querySelectorAll(".playlist_tables .play_track")
  );
  console.log(rawSongs.length);
  const songsAfterNine = rawSongs.map((songContainer: any) => {
    const artist = songContainer.querySelector(".trackinterpret").textContent as string || "";
    const title = songContainer.querySelector(".tracktitle").textContent as string || "";

    return {
      artist,
      title,
    }
  });

  return songsAfterNine;
}

const extractSongsFromFinalPlaylist = (htmlString: string): Array<Song> => {
  const dom = new JSDOM(htmlString);

  const rawSongs: Array<TimedSong> = Array.from(
    dom.window.document.querySelectorAll(".table tr")
  );

  const songsAfterNine = rawSongs.map((songContainer: any) => {
    const artist = songContainer.querySelector("td:nth-child(2)").textContent as string || "";
    const title = songContainer.querySelector("td:nth-child(3)").textContent as string || "";

    return {
      artist,
      title,
    }
  });

  return songsAfterNine;
}

enum Categories {
  NUR_EIN_WORT = "Top100NurEinWort",
  ONE_LOVE = "Top100OneLove",
  DARKNESS = "Top100Darkness",
  FRIEND = "Top100Friend",
  FIFTIES = "Top100Fifties",
  NIGHT = "Top100Night",
  DISKO = "Top100Disko"
}

const playlistPages = new Map<string, Array<string>>();
playlistPages.set(Categories.NUR_EIN_WORT, [
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250803_0900.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250803_1200.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250803_1500.html",
]);
playlistPages.set(Categories.ONE_LOVE, [
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/07/250727_0900.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/07/250727_1200.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/07/250727_1500.html",
]);
playlistPages.set(Categories.DARKNESS, [
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250810_0900.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250810_1200.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250810_1500.html",
]);
playlistPages.set(Categories.FRIEND, [
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250817_0900.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250817_1200.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250817_1500.html",
]);

const finalPlaylistPage: Map<string, string> = new Map();
finalPlaylistPage.set(Categories.DARKNESS, "https://www.radioeins.de/musik/top_100/2025/dark-wave/our_darkness_die_top_100.html");
finalPlaylistPage.set(Categories.ONE_LOVE, "https://www.radioeins.de/musik/top_100/2025/reggae/reggae_die_top_100.html");
finalPlaylistPage.set(Categories.NUR_EIN_WORT, "https://www.radioeins.de/musik/top_100/2025/wort/nur_ein_wort_die_top_100.html");
finalPlaylistPage.set(Categories.FRIEND, "https://www.radioeins.de/musik/top_100/2025/wort/nur_ein_wort_die_top_100.html")

export const getFinalPunkte = async (sonntagsId: string): Promise<Array<PlaylistSong>> => {
  const finalListUrl = finalPlaylistPage.get(sonntagsId)!;
  const request = await fetch(finalListUrl);
  const htmlPage = await request.text();

  const finalPlaylist = extractSongsFromFinalPlaylist(htmlPage);

  return finalPlaylist.map((value, index) => ({
    ...value,
    position: index + 1,
  }))
}

export const getLivePunkte = async (sonntagsId: string): Promise<Array<PlaylistSong>> => {
  const pages = playlistPages.get(sonntagsId)
  if(!pages) {
    return [];
  }
  const htmlPages = await Promise.all(pages.map(async (url) => {
    const res = await fetch(url);
    if (res.status === 200) {
      return res.text();
    }
    return false;
  }))


  const playlist: Array<Song> = htmlPages
    .filter((a) => typeof a === "string")
    .map((text) => {
      return extractSongsFromHtml(text);
    })
    .flat(1);
  
    if (sonntagsId === "Top100NurEinWort") {
      playlist.push({artist: "Radiohead", title: "Creep"});
    }
  
  return playlist.map((s, index) => ({
    ...s,
    position: 100 - index,
  }));
};
