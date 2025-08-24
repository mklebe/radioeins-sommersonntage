import { Song } from "../types";
import { findDoubles } from "./findDoubles";


describe("find doubles", () => {
  it("must find no doubles in a list of unique songs", () => {
    const bingofeld: Array<Song> = [
      {artist: "Elvis Presley", title: "Hound Dog"},
      {artist: "Johnny Cash", title: "I walk the line"},
      {artist: "Bill Halley and His Comets", title: "Rock'n around the Clock"},
      {artist: "Mama Thorton", title: "Hound Dog"},
      {artist: "Carl Perkins", title: "Blue Suede Shoes"},
      {artist: "Cornelia Froboess", title: "Pack die Badehose ein"}
    ];

    const {doublesFound} = findDoubles(bingofeld);

    expect(doublesFound).toBe(false);
  });

  it("must find two doubles in a list two times the same song", () => {
    const bingofeld: Array<Song> = [
      {artist: "Elvis Presley", title: "Hound Dog"},
      {artist: "Johnny Cash", title: "I walk the line"},
      {artist: "Bill Halley and His Comets", title: "Rock'n around the Clock"},
      {artist: "Mama Thorton", title: "Hound Dog"},
      {artist: "Carl Perkins", title: "Blue Suede Shoes"},
      {artist: "Cornelia Froboess", title: "Pack die Badehose ein"},
      {artist: "Elvis Presley", title: "Hound Dog"},
    ];

    const {doublesFound, doubleFields} = findDoubles(bingofeld);

    expect(doublesFound).toBe(true);
    expect(doubleFields).toEqual([0, 6])
  });

  it("must find three doubles in a list of three times the same song", () => {
    const bingofeld: Array<Song> = [
      {artist: "Elvis Presley", title: "Hound Dog"},
      {artist: "Johnny Cash", title: "I walk the line"},
      {artist: "Bill Halley and His Comets", title: "Rock'n around the Clock"},
      {artist: "Mama Thorton", title: "Hound Dog"},
      {artist: "Carl Perkins", title: "Blue Suede Shoes"},
      {artist: "Cornelia Froboess", title: "Pack die Badehose ein"},
      {artist: "Elvis Presley", title: "Hound Dog"},
      {artist: "Elvis Presley", title: "Hound Dog"},
    ];

    const {doublesFound, doubleFields} = findDoubles(bingofeld);

    expect(doublesFound).toBe(true);
    expect(doubleFields).toEqual([0, 6, 7])
  });

  it("must find four doubles in a list of two doubles", () => {
    const bingofeld: Array<Song> = [
      {artist: "Elvis Presley", title: "Hound Dog"},
      {artist: "Johnny Cash", title: "I walk the line"},
      {artist: "Bill Halley and His Comets", title: "Rock'n around the Clock"},
      {artist: "Mama Thorton", title: "Hound Dog"},
      {artist: "Carl Perkins", title: "Blue Suede Shoes"},
      {artist: "Cornelia Froboess", title: "Pack die Badehose ein"},
      {artist: "Elvis Presley", title: "Hound Dog"},
      {artist: "Johnny Cash", title: "I walk the line"},
    ];

    const {doublesFound, doubleFields} = findDoubles(bingofeld);

    expect(doublesFound).toBe(true);
    expect(doubleFields).toEqual([0, 1, 6, 7])
  });

  it("must find four doubles in a list of two doubles", () => {
    const bingofeld: Array<Song> = [
      {artist: "", title: ""},
      {artist: "", title: ""},
      {artist: "Bill Halley and His Comets", title: "Rock'n around the Clock"},
      {artist: "Mama Thorton", title: "Hound Dog"},
      {artist: "Carl Perkins", title: "Blue Suede Shoes"},
      {artist: "", title: ""},
      {artist: "Elvis Presley", title: "Hound Dog"},
      {artist: "Johnny Cash", title: "I walk the line"},
    ];

    const {doublesFound, doubleFields} = findDoubles(bingofeld);

    expect(doublesFound).toBe(false);
    expect(doubleFields).toEqual([])
  })
});