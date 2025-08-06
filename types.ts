import { PlaylistSong } from "./pages/updatePage";

export interface Song {
  artist: string;
  title: string;
}

export interface Sonntag {
    id: string;
    name: string;
    date: Date;
    playlist: Array<PlaylistSong>
};

export type SerializableSonntag = Omit<Sonntag, "date"> & {"date": string};

export interface User {
    id: string;
    name: string;
    gesamtpunktzahl: number;
};

export enum TippStatus {
    NOT_HIT,
    IN_LIST,
    CORRECT_COLUMN,
    JOKER,
    CORRECT_WINNER,
}

// export interface Tipp {
//     punktzahl: number;
//     bingofeld: Array<Song>;
//     tippStatus: Array<TippStatus>
// };

export interface SonntagsTipp {
    id: string;
    bingofeld: Array<Song>;
    joker: number | null;
    tippStatus: Array<TippStatus>;
    punktzahl: number;
}
