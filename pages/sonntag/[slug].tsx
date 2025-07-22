import { getSonntagById, Sonntag } from "../../services/database";

type SerializableSonntag = Omit<Sonntag, "date"> & {"date": string}

export default function Overview({sonntag}: {sonntag: SerializableSonntag}) {

       

    if (sonntag) {
        return <>
          <h1>{sonntag.name}</h1>
          <p>{sonntag.date}</p>
        </>
    }
}

// Serverseitiges Data Fetching mit Zugriff auf den dynamischen Slug
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const sonntag = await getSonntagById(slug);

  if (!sonntag) {
    return {
      notFound: true,
    }
  }

  const serializableSonntag: SerializableSonntag = {...sonntag, date: sonntag.date.toLocaleString()} 

  return {
    props: {sonntag: serializableSonntag},
  }
}
