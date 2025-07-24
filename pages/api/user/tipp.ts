import { NextApiRequest, NextApiResponse } from "next"
import { saveUserTipp } from "../../../services/database"


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const {userid, sonntag, bingofeld} = JSON.parse(request.body)
  console.log(request.body);
  saveUserTipp(userid, sonntag, JSON.parse(bingofeld));  

  return response.status(200).json({ success: true })
}