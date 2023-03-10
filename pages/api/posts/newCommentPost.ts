import postComment from "@/lib/blog/postaComment";
import cookie from "@/lib/cookie";
import fetchUserID from "@/lib/user/getUserByToken";
import { getCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const token = getCookie(cookie, { req, res });
  if (!token) {
    res.status(401).json({ message: `Not Authorized` });
    return;
  }
  if (!req.body.message || !req.body.postID) {
    res.status(400).json({ message: `Bad Request` });
    return;
  }
  try {
    const userId = await fetchUserID(token as string);
    console.log(userId.userID);
    const returnData = await postComment(
      req.body.postID,
      userId.userID,
      req.body.message,
      req.body.parentID ? req.body.parentID : null
    );
    console.log(returnData);
    res.status(200).json({ success: "Comment Successfully Created" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Creating Your Post ` });
  }
}
