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

const playlistPages = new Map<string, Array<string>>();
playlistPages.set("Top100NurEinWort", [
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250803_0900.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250803_1200.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250803_1500.html",
]);
playlistPages.set("Top100OneLove", [
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/07/250727_0900.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/07/250727_1200.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/07/250727_1500.html",
]);
playlistPages.set("Top100Darkness", [
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250810_0900.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250810_1200.html",
  "https://www.radioeins.de/programm/sendungen/sondersendung/playlisten/2025/08/250810_1500.html",
]);

export const getLivePunkte = async (sonntagsId: string) => {
  const pages = playlistPages.get(sonntagsId)
  if(!pages) {
    return;
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
