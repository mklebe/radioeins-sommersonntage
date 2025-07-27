import Link from "next/link";
import { getSonntage, getUserById } from "../../services/database";
import { SerializableSonntag, Sonntag, User } from "../../types";
import { GetServerSidePropsContext } from "next";
import { Box, Card, Typography } from "@mui/material";

export default function SonntagPage({ sonntage, user }: {sonntage: Array<Sonntag>, user: User}) {
  return (
    <div>
      <Typography variant="h2" mb="24px">Hallo {user.name}</Typography>
      <Typography variant="h4" mb="16px">Tippabgaben</Typography>
      <Box
        display="grid"
        gridTemplateColumns="repeat(5, 1fr)"
        gap={2}
        mb="24px"
      >
        {sonntage
          .map(( {id, name, date} ) => {
            return (
              <Card sx={{p: "8px"}} key={name}>
                <Link key={id} href={`/sonntag/${id}`}>
                  {name}<br /><br />
                  {date.toLocaleString()}
                </Link>
              </Card>
            )
          })}
      </Box>
      <Typography variant="h4" mb="16px">Ergebnisse</Typography>
      <Box
        display="grid"
        gridTemplateColumns="repeat(5, 1fr)"
        gap={2}
      >
              <Card sx={{p: "8px"}}>
                <Link href={`/ergebnisse/Top100OneLove`}>
                  One Love - Die 100 besten Reggae Songs inkl. Ska & Dub

                </Link>
              </Card>
      </Box>
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