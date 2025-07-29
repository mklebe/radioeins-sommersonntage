import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loginStateMessage, setLoginStateMessage] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  const login = async (evt: FormEvent) => {
    evt.preventDefault();
    setLoginStateMessage("Starte login");
    // Validate form fields
    const response = await fetch(`/api/user/${userId}`);
    if (response.status === 200) {
      router.push("/sonntag")
      setLoginStateMessage("Login Erfolgreich");
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
    </div>
  );
};
