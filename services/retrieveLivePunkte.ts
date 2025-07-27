import { Song } from "../types";

const sonntagStart = new Date();
sonntagStart.setHours(9);
sonntagStart.setMinutes(0);


interface TimedSong extends Song {
  time: Date;
}

type SerializedTimedSong = Omit<TimedSong, "time"> & {time: string} 

export const getLivePounkte = async () => {
  const playlistPage = await fetch("https://www.radioeins.de/musik/playlists.html", {
    method: "GET"
  })
  const a = await playlistPage.text()
  const dom = new JSDOM(a);
  const headlines: Array<string> = Array.from(
    dom.window.document.querySelectorAll(".playlist_tables h3 a")
  ).map((i: any) => i.textContent as string);

  const rawSongs: Array<TimedSong> = Array.from(
    dom.window.document.querySelectorAll(".playlist_tables .play_track")
  );
  console.log(rawSongs.length);
  const songsAfterNine = rawSongs.map((songContainer: any) => {
    const artist = songContainer.querySelector(".trackinterpret").textContent as string || "";
    const title = songContainer.querySelector(".tracktitle").textContent as string || "";
    const timeString = songContainer.querySelector(".play_time").textContent;
    const [hours, minutes] = timeString.split(":")
    const time = new Date();
    time.setMinutes(minutes);
    time.setHours(hours);

    return {
      artist,
      title,
      time: {
        minutes,
        hours
      },
    }
  })
    .filter(({time: {hours}}) => hours >= sonntagStart.getHours())
  
  let dayBreakIndex = 0;
  songsAfterNine.forEach((s, index) => {
    if (index > 0) {

      console.log(songsAfterNine[index - 1].artist)
      if(s.time.hours > songsAfterNine[index - 1].time.hours) {
        console.log("DayBreakIndex: " + index)
        dayBreakIndex = index;
      }
      console.log(s.time.hours);
    }
  })
  const sonntagsSongs = songsAfterNine.slice(0, dayBreakIndex); 
  

  console.log(sonntagsSongs.length)

  const playlist: Array<SerializedTimedSong> = sonntagsSongs.map(({artist, title, time}) => ({
    artist,
    title,
    time: `${time.getHours()}:${time.getMinutes()}`
  }))

  return playlist;
};
