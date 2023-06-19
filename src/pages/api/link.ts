import { env } from "@/env/server.mjs";
import { randomBytes } from "crypto";
import Redis from "ioredis";
import { NextApiHandler } from "next";

const redis = new Redis(env.REDIS_URL);

const createCode = () => randomBytes(8).toString("hex");

const POST: NextApiHandler = async (req, res) => {
  const tree = req.body;

  const base64 = Buffer.from(JSON.stringify(tree)).toString("base64");

  const shortcode = await redis.get(`tree:${base64}`);
  if (shortcode) {
    res.status(200).json({ code: shortcode });
    return;
  }
  await redis.set(`tree:${base64}`, createCode());
  const newShortcode = await redis.get(`tree:${base64}`);
  await redis.set(`shortcode:${newShortcode}`, base64);

  res.status(200).json({ code: newShortcode });
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return POST(req, res);
    default:
      res.status(405).end();
  }
};

export default handler;
