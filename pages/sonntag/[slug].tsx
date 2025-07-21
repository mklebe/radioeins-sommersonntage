import { getSonntagById, Sonntag } from "../../services/database";

export default function Overview({sonntag}: {sonntag: Sonntag}) {

       

    if (sonntag) {
        return <h1>{sonntag.name}</h1>
    }
}

// Serverseitiges Data Fetching mit Zugriff auf den dynamischen Slug
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const sonntag = await getSonntagById(slug); 
  return {
    props: {sonntag},
  }
}
