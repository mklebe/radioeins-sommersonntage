import Link from "next/link";
import { getSonntage, getUserById } from "../../services/database";
import { SerializableSonntag, Sonntag, User } from "../../types";
import { GetServerSidePropsContext } from "next";

export default function SonntagPage({ sonntage, user }: {sonntage: Array<Sonntag>, user: User}) {
  return (
    <div>
      <h1>Hallo {user.name}</h1>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sonntage = await getSonntage();
  const { userid } = context.req.cookies;

  if(userid === undefined) {
    return {
      notFound: true,
    }
  }

  const user = await getUserById(userid);

  if (!sonntage || !user) {
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
    props: {sonntage: serializableSonntag, user},
  }
};