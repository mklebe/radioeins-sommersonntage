import { Song } from "../types";

interface FindDoublesResult {
  doublesFound: boolean;
  doubleFields: Array<number>;
}

export const findDoubles = (bingofeld: Array<Song>): FindDoublesResult => {
  const hashedFields: Array<string | null> = bingofeld.map(({artist, title}) => {
    if(artist === "" && title === "") {
      return null;
    }
    return `${artist}_${title}`;
  });

  const doubleFields: Array<number> = hashedFields.reduce((aggregate, value, index) => {
    if(hashedFields.filter((a) => a!== null && a === value ).length > 1) {
      aggregate.push(index);
    }

    return aggregate;
  }, [] as Array<number>);

  if(doubleFields.length > 0) {
    return {
      doublesFound: true,
      doubleFields
    }
  }

  return {
    doublesFound: false,
    doubleFields: [],
  }
}