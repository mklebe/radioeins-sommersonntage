import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const login = async (formData: FormData) => {
    // Validate form fields
    const userId = formData.get("username");
    const response = await fetch(`/api/user/${userId}`);
    if (response.status === 200) {
      router.push("/sonntag")
    }
  }

  return (
    <div>
      <h1>Hello stranger!</h1>
      <form action={login}>
        <label htmlFor="">Benutzer ID<input name="username" type="text"></input></label>
        <button type="submit">Anmelden</button>
      </form>
    </div>
  );
};
