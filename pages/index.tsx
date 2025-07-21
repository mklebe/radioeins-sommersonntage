
import Link from "next/link";
import { getSonntage } from "../services/database";

export default async function Home() {
  
    const sonntage = await getSonntage();

  return (
    <div>
      <h1>It work's! Now it really does!</h1>
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
