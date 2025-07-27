import { GetServerSidePropsContext } from "next";
import { getAllTipsBySonntag, getSonntagById, getUserById } from "../../services/database";
import Link from "next/link";
import { Song, Tipp, TippStatus, User } from "../../types";
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Typography } from "@mui/material";

const tippStatusColorMapping = new Map<TippStatus, string>();
tippStatusColorMapping.set(TippStatus.NOT_HIT, "transparent");
tippStatusColorMapping.set(TippStatus.IN_LIST, "yellow");
tippStatusColorMapping.set(TippStatus.CORRECT_COLUMN, "green");
tippStatusColorMapping.set(TippStatus.CORRECT_WINNER, "red");
tippStatusColorMapping.set(TippStatus.JOKER, "rebeccapurple");

type BingofeldProps = {
  bingofeld: Array<Song>,
  bingofeldHits: Array<TippStatus>
}

function Bingofeld({bingofeld, bingofeldHits}: BingofeldProps) {
  return <Box
      display="grid"
      gridTemplateColumns="repeat(5, 1fr)"
      gap={2}
    >
      <div>100 - 81</div>
      <div>80 - 61</div>
      <div>60 - 41</div>
      <div>40 - 21</div>
      <div>20 - 1</div>
      {bingofeld.map((song, index) => {
        const backgroundColor = tippStatusColorMapping.get(bingofeldHits[index]);
       
        return <Paper
         sx={{ backgroundColor, cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 1 }}
         key={`song_${index}`}>
            {song.artist} - {song.title}
          </Paper>
        
      })}
    </Box>
}

interface OverviewProps {
  user: User,
  tipps: Array<Tipp & {user: User}>,
  sonntagsName: string,
}

export default function Overview({ user, tipps, sonntagsName}: OverviewProps
   ) {
    console.log(tipps.length);
  
    

    return <>
      <Link href="/sonntag">Zurück zur Übersicht</Link>
      <h1>{sonntagsName}</h1>
      <p>Tipps von: {user.name}</p>

      

        {tipps.map((t) => {
          return <Accordion key={`usertipp_${t.user.id}`}>
            <AccordionSummary >
              <Typography variant="h6">Liste von {t.user.name} mit {t.punktzahl} Punkten</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Bingofeld bingofeld={t.bingofeld} bingofeldHits={t.tippStatus} />
            </AccordionDetails>
          </Accordion>
        })}
      
    </>

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {slug} = context.params!;
  const { userid } = context.req.cookies;

  if(userid === undefined) {
    return {
      notFound: true,
    }
  }
  if(slug === undefined || typeof slug !== "string") {
    return {
      notFound: true,
    }
  }

  const [user, allSonntagTipps, sonntag] = await Promise.all([getUserById(userid), getAllTipsBySonntag(slug), getSonntagById(slug)]);
  
  if (!allSonntagTipps || !user || !sonntag ) {
    return {
      notFound: true,
    }
  }

  const userTipps = (await Promise.all(
    allSonntagTipps.map(async (st) => ({
      ...st,
      user: await getUserById(st.id.split("_")[0]),
    }))
  )).sort((a, b) => b.punktzahl - a.punktzahl);

  const transferredUser: User = {
    id: user.id,
    gesamtpunktzahl: user.gesamtpunktzahl,
    name: user.name,
  }

  return {
    props: {
      sonntagsName: sonntag.name,
      user: transferredUser,
      tipps: userTipps,
    },
  }
}
