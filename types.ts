export interface Song {
  artist: string;
  title: string;
}

export interface Sonntag {
    id: string;
    name: string;
    date: Date;
    playlist: Array<Song>
};

export type SerializableSonntag = Omit<Sonntag, "date"> & {"date": string};

export interface User {
    id: string;
    name: string;
    gesamtpunktzahl: number;
};

export interface Tipp {
    sonntag: string;
    punktzahl: number;
    bingofeld: Array<string>;
};