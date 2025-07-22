import Link from "next/link";
import { getSonntage } from "../../services/database";
import { SerializableSonntag, Sonntag } from "../../types";

export default function SonntagPage({ sonntage }: {sonntage: Array<Sonntag>}) {
  console.log(sonntage)
  return (
    <div>
      <h1>It works! Now it really does!</h1>
      <ul>
        {sonntage
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
  )
};

export async function getServerSideProps() {
  const sonntage = await getSonntage();
  console.log(sonntage);
  
  if (!sonntage) {
    return {
      notFound: true,
    }
  }

  const sortedSonntage = sonntage
    .sort((a, b) => a.date.getTime() - b.date.getTime())
  
    const serializableSonntag: Array<SerializableSonntag> = sortedSonntage.map((s: Sonntag) => ({
      ...s,
      date: s.date.toLocaleDateString(),
    }))
  
    return {
      props: {sonntage: serializableSonntag},
    }
};