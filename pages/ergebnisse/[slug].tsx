import { GetServerSidePropsContext } from "next";
import { getAllTipsBySonntag, getSonntagById, getUserById } from "../../services/database";
import Link from "next/link";
import { Song, Tipp, TippStatus, User } from "../../types";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

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

type PlaylistProps = {
  list: Array<Song>,
}
function Playlist({list}: PlaylistProps) {
  return <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Song</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map(({artist, title}, index) => {
            return <TableRow key={`${title}_${index}`}>
              <TableCell>{1 + index}</TableCell>
              <TableCell>{artist} - {title}</TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
    </TableContainer>
}

interface OverviewProps {
  user: User,
  tipps: Array<Tipp & {user: User}>,
  sonntagsName: string,
  sonntagPlaylist: Array<Song>,
}

export default function Overview({ user, tipps, sonntagsName, sonntagPlaylist}: OverviewProps
   ) {
  return <>
      <Link href="/sonntag">Zurück zur Übersicht</Link>
      <Typography variant="h6" mb="32px">{sonntagsName}</Typography>
      <Grid container>
        <Grid size={8} gap={2}>
          <Typography variant="h6">Sonntags Playliste</Typography>
          <Playlist list={sonntagPlaylist.reverse()} />
        </Grid>
        <Grid size={4}>
          <Typography variant="h6">Spieler Punkte</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Spieler</TableCell>
                  <TableCell align="right">Punktzahl</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

              </TableBody>
              {tipps.map((t, index) => {
                return <TableRow key={`score_${index}`}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{t.user.name}</TableCell>
                    <TableCell align="right">{t.punktzahl}</TableCell>
                </TableRow>
              })}
            </Table>
          </TableContainer>
          <Link href="#nutzerlisten">Tipps aller Spieler</Link>
        </Grid>
      </Grid>
      {tipps.map((t) => {
          return <Accordion id="nutzerlisten" key={`usertipp_${t.user.id}`}>
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

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{props: OverviewProps} | {notFound: boolean}> {
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
      sonntagPlaylist: sonntag.playlist,
      user: transferredUser,
      tipps: userTipps,
    },
  }
}
