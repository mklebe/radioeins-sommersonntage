
import Link from "next/link";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <div>
      <h1>Übersicht über alle Sonntage</h1>
      <Typography>Du findest die aktuellen Sonntagslisten <Link href={`/sonntag/`}>auf der Kategorieseite</Link></Typography>
    </div>
  );
};
