import Link from "next/link";
import { getSonntage, getUserById } from "../../services/database";
import { SerializableSonntag, Sonntag, User } from "../../types";
import { GetServerSidePropsContext } from "next";
import { Box, Card, Grid, Typography } from "@mui/material";
import { redirect } from "next/navigation";

export default function SonntagPage({ sonntage, user }: {sonntage: Array<Sonntag>, user: User}) {
  return (
    <div>
      <Typography variant="h2" mb="24px">Hallo {user.name}</Typography>
      <Typography variant="h4" mb="16px">Tippabgaben</Typography>
      <Grid
        display="grid"
        gap={2}
        mb="24px"
        sx={{
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)'
          }
        }}
        
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
      </Grid>
      <Typography variant="h4" mb="16px">Ergebnisse</Typography>
      <Box
        display="grid"
        sx={{
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)'
          }
        }}
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
    console.warn(`Called /sonntag without userid, redirecting to login page`);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  const user = await getUserById(userid);
  if(!user) {
    console.warn(`Could not retrieve user with id ${userid}, redirecting to login page.`);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  if (!sonntage) {
    return {
      notFound: true,
    }
  }

  const sortedSonntage = sonntage
    .filter((a) => a.date.getTime() > new Date().getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const serializableSonntag: Array<SerializableSonntag> = sortedSonntage.map((s: Sonntag) => ({
    ...s,
    date: s.date.toLocaleDateString(),
  }))

  return {
    props: {sonntage: serializableSonntag, user},
  }
};