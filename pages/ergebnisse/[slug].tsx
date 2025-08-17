import { GetServerSidePropsContext } from "next";
import { getAllTipsBySonntag, getSonntagById, getUserById, saveJoker } from "../../services/database";
import Link from "next/link";
import { Song, SonntagsTipp, TippStatus, User } from "../../types";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { calculatePointsForTipps } from "../../services/punktberechnung";
import { PlaylistSong } from "../updatePage";

const tippStatusColorMapping = new Map<TippStatus, string>();
tippStatusColorMapping.set(TippStatus.NOT_HIT, "transparent");
tippStatusColorMapping.set(TippStatus.IN_LIST, "yellow");
tippStatusColorMapping.set(TippStatus.CORRECT_COLUMN, "green");
tippStatusColorMapping.set(TippStatus.CORRECT_WINNER, "red");
tippStatusColorMapping.set(TippStatus.JOKER, "rebeccapurple");

const fontColorMapping = new Map<TippStatus, string>();
fontColorMapping.set(TippStatus.NOT_HIT, "black");
fontColorMapping.set(TippStatus.IN_LIST, "black");
fontColorMapping.set(TippStatus.CORRECT_COLUMN, "white");
fontColorMapping.set(TippStatus.CORRECT_WINNER, "white");
fontColorMapping.set(TippStatus.JOKER, "black");

type BingofeldProps = {
  bingofeld: Array<Song>;
  bingofeldHits: Array<TippStatus>;
  songClicked: (songIndex: number) => void;
}

function Bingofeld({bingofeld, bingofeldHits, songClicked}: BingofeldProps) {
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
      {bingofeld.map(({artist, title}, index) => {
        const backgroundColor = tippStatusColorMapping.get(bingofeldHits[index]);
        const color = fontColorMapping.get(bingofeldHits[index])
       
        return <Paper
          onClick={() => songClicked(index)}
         sx={{ backgroundColor, color, cursor: "pointer",  padding: 1 }}
         key={`song_${index}`}>
            <Typography sx={{fontWeight: 700, display: "block"}}>{artist}</Typography>
            <Typography>{title}</Typography>
          </Paper>
        
      })}
    </Box>
}

type PlaylistProps = {
  list: Array<PlaylistSong>,
}
function Playlist({list}: PlaylistProps) {
  list.sort((a, b) => a.position - b.position)

  return <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Song</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map(({artist, title, position}, index) => {
            return <TableRow key={`${title}_${index}`}>
              <TableCell>{position}</TableCell>
              <TableCell>
                <Typography sx={{fontWeight: 700}}>{artist}</Typography>
                <Typography>{title}</Typography>
              </TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
    </TableContainer>
}

interface PlayersTableProps {
  tipps: UserTipps
}

const PlayersTable = ({tipps}: PlayersTableProps) => {
  return <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Spieler</TableCell>
                  <TableCell align="right">Punktzahl</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tipps.map((t, index) => {
                  return <TableRow key={`score_${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{t.user.name}</TableCell>
                      <TableCell align="right">{t.punktzahl}</TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
}


interface OverviewProps {
  user: User,
  tipps: UserTipps,
  sonntagsName: string,
  sonntagPlaylist: Array<PlaylistSong>,
  sonntagsId: string,
}

export default function Overview(
  { user, tipps, sonntagsName, sonntagPlaylist, sonntagsId}: OverviewProps
) {
  const [ownTipps] = tipps.filter((t) => t.user.id === user.id);
  const otherUsersTipps = tipps.filter((t) => t.user.id !== user.id);

  const [ownBingofeld] = useState<Array<Song>>(ownTipps.bingofeld);
  const [ownTippStatus, setOwnTippStatus] = useState<Array<TippStatus>>(ownTipps.tippStatus);
  const [userPunktzahl, setUserPunktzahl] = useState<number>(ownTipps.punktzahl);

  const updateLivePunkte = async () => {
    await fetch(`/getLivepunkte?sonntagsId=${sonntagsId}`);
    await fetch(`/updatePage?sonntagsId=${sonntagsId}`);
    window.location.reload();
  }
  
  const setJoker = (songIndex: number) => {
    const tippStatusCopy = [...ownTipps.tippStatus];
    const tippCopy = {...ownTipps};
    tippCopy.joker = songIndex;
    tippStatusCopy[songIndex] = TippStatus.JOKER;
    const {punktzahl, hits} = calculatePointsForTipps(tippCopy, sonntagPlaylist);
    setOwnTippStatus(hits);
    setUserPunktzahl(punktzahl);
    console.log(songIndex, hits)
    saveJoker(user.id, sonntagsId, songIndex, hits, punktzahl);
  }

  return <>
      <Link href="/sonntag">Zurück zur Übersicht</Link>
      <Typography variant="h6" mb="32px">{sonntagsName}</Typography>
      <Grid container spacing={4}>
        {ownTipps && <Grid size={12} mb="24px">
          <Typography variant="h6">Punkte von {user.name}</Typography>
          <Typography>{userPunktzahl} Punkte</Typography>
          <Bingofeld songClicked={(index) => setJoker(index)} bingofeld={ownBingofeld} bingofeldHits={ownTippStatus} />
          <Button sx={{mt: "16px"}} variant="contained" onClick={updateLivePunkte}>Punkte aktualisieren</Button>
        </Grid>}
        <Grid size={8} gap={2}>
          <Typography variant="h6">Sonntags Playliste</Typography>
          <Playlist list={sonntagPlaylist} />
        </Grid>
        <Grid size={4}>
          <Typography variant="h6">Spieler Punkte</Typography>
          <PlayersTable tipps={tipps} />
          <Link href="#nutzerlisten">Tipps aller Spieler</Link>
        </Grid>
      </Grid>
      {otherUsersTipps.map((t) => {
          return <Accordion id="nutzerlisten" key={`usertipp_${t.user.id}`}>
            <AccordionSummary >
              <Typography variant="h6">Liste von {t.user.name} mit {t.punktzahl} Punkten</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Bingofeld songClicked={() => {}} bingofeld={t.bingofeld} bingofeldHits={t.tippStatus} />
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

  const userTipps: UserTipps = (await Promise.all(
    allSonntagTipps.map(async (st) => ({
      ...st,
      user: await getUserFromTipp(st),
    }))
  )).sort((a, b) => b.punktzahl - a.punktzahl);

  const transferredUser: User = {
    id: user.id,
    gesamtpunktzahl: user.gesamtpunktzahl,
    name: user.name,
  }

  return {
    props: {
      sonntagsId: sonntag.id,
      sonntagsName: sonntag.name,
      sonntagPlaylist: sonntag.playlist,
      user: transferredUser,
      tipps: userTipps,
    },
  }
}

const getUserFromTipp = async (tipp: SonntagsTipp): Promise<User> => {
  const userId = tipp.id.split("_")[0];
  const user = await getUserById(userId);

  if (user === null) {
    return {
      id: "999",
      gesamtpunktzahl: 0,
      name: "unknown"
    }
  }

  return user;
}

type UserTipps = Array<{user: User} & SonntagsTipp>;
