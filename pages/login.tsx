import { Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { getUserById } from "../services/database";
import { setCookie } from "cookies-next";


const REDIRECT_TIMEOUT_START = 10;

export default function Home() {
  const router = useRouter();
  const [loginStateMessage, setLoginStateMessage] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(REDIRECT_TIMEOUT_START);

  const decrementRedirectCountdown = (): void => {
    setRedirectCountdown((previousValue: number) => {
      if(previousValue > 0) {
        return (previousValue -= 1);
      } else {
        return previousValue = 0;
      }
    })
  };

  let intervalHandle;
  const login = async (evt: FormEvent) => {
    evt.preventDefault();
    setLoginStateMessage("Starte login");
    if( !userId ) {
      return;
    }
    const user = await getUserById(userId);
    console.log(user);
    if (user) {
      setCookie("userid", userId);
      router.push("/sonntag")
      setLoginStateMessage(`Login Erfolgreich. Automatische weiterleitung aktiv. `);
      intervalHandle = window.setInterval(() => {
        decrementRedirectCountdown();
      }, 1_000)
    } else {
      setLoginStateMessage(`Konnte Nutzer ${userId} nicht anmelden. Bitte kontaktiere den Admin.`);
    }
  }
  if(redirectCountdown === 0) {
    window.clearInterval(intervalHandle);
  }

  return (
    <div>
      <h1>Hello stranger!</h1>
      <form onSubmit={login}>
        <label htmlFor="">Benutzer ID<input name="username" type="text" onChange={(evt) => setUserId(evt.target.value)}></input></label>
        <button type="submit">Anmelden</button>
      </form>
      <Typography mt="24px" variant="body1">{loginStateMessage}</Typography>
      {redirectCountdown !== REDIRECT_TIMEOUT_START && redirectCountdown !== 0 && <Typography>...{redirectCountdown}</Typography>}
      {redirectCountdown === 0 && <Link href="/sonntag">Weiter zum Sonntag</Link> }
    </div>
  );
};
