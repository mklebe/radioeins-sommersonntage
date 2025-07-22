export interface Sonntag {
    id: string;
    name: string;
    date: Date;
};

export type SerializableSonntag = Omit<Sonntag, "date"> & {"date": string};

export interface User {
    id: string;
    name: string;
    gesamtpunktzahl: number;
    tipps: Array<Tipp>
};

export interface Tipp {
    sonntag: string;
    punktzahl: number;
    bingofeld: Array<string>;
};