
import Link from "next/link";
import { getSonntage } from "../services/database";
import { useEffect, useState } from "react";
import { Sonntag } from "../types";

export default function Home() {
  const [sonntage, setSonntage] = useState<Array<Sonntag>>([]);
  useEffect(() => {
    getSonntage().then((s) => setSonntage(s))
  }, []);

  return (
    <div>
      <h1>Übersicht über alle Sonntage</h1>
      <ul>
        {sonntage
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(( {id, name, date} ) => {
          return (
            <Link key={id} href={`/sonntag/${id}`}>
              <li style={{
                padding: "8px",
                listStyle: "none",
              }}>
              {name} - {id}<br />
              {date.toLocaleString()}<br />
              
              </li>
            </Link>)
        })}
      </ul>
    </div>
  );
};
