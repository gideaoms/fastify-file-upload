import fastify from "fastify";
import multipart from "fastify-multipart";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import crypto from "crypto";

const app = fastify({ logger: process.env.NODE_ENV === "development" });
const port = 3000;

app.register(multipart);

app.post("/", async (request) => {
  const data = await request.file();
  const filename = crypto.randomBytes(20).toString("hex");
  const extension = path.extname(data.filename) ?? ".jpg";
  const filepath = path.join("tmp", `${filename}${extension}`);
  await pipeline(data.file, fs.createWriteStream(filepath));
  return { filepath: filepath };
});

app.listen(port);
