import { NextApiRequest, NextApiResponse } from "next"
import { getUserById } from "../../../services/database"
import { serialize } from "cookie";


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { userId } = request.query;
  if(userId === undefined || typeof userId !== "string") {
    return response.status(404).json({message: "User not found"});
  }
  const user = await getUserById(userId)

  if(!user) {
    return response.status(404).json({message: "User not found"});
  }
  const cookie = serialize('userid', user.id, {
      httpOnly: true,       // Kann im Browser nicht per JS ausgelesen werden
      secure: process.env.NODE_ENV === 'production', // nur über HTTPS in prod
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 Tage in Sekunden
    });

    response.setHeader('Set-Cookie', cookie)
  

  return response.status(200).json({ ...user, success: true })
}