import { Typography } from "@mui/material";
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

  const login = async (evt: FormEvent) => {
    evt.preventDefault();
    setLoginStateMessage("Starte login");
    if( !userId ) {
      return;
    }
    const user = await getUserById(userId);
    if (user) {
      setCookie("userid", userId);
      router.push("/sonntag")
      setLoginStateMessage(`Login Erfolgreich. Automatische weiterleitung aktiv. `);
      const intervalHandle = window.setInterval(() => {
        setRedirectCountdown(redirectCountdown-1);
        if(redirectCountdown === 0) {
          window.clearInterval(intervalHandle);
        }
      }, 1_000)
    } else {
      setLoginStateMessage(`Konnte Nutzer ${userId} nicht anmelden. Bitte kontaktiere den Admin.`);
    }
  }

  return (
    <div>
      <h1>Hello stranger!</h1>
      <form onSubmit={login}>
        <label htmlFor="">Benutzer ID<input name="username" type="text" onChange={(evt) => setUserId(evt.target.value)}></input></label>
        <button type="submit">Anmelden</button>
      </form>
      <Typography mt="24px" variant="body1">{loginStateMessage}</Typography>
      {redirectCountdown !== REDIRECT_TIMEOUT_START && <Typography>...{redirectCountdown}</Typography>}
      {/* {redirectCountdown === 0 && } */}
    </div>
  );
};
