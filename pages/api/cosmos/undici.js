const { generateHeaders } = require("cosmos-sign");
import { request } from "undici";

const [endpoint, key] = process.env.COSMOS_CONNECTION_STRING.split(";").map(
  (part) => part.split(/=(.+)/)[1]
);

let functionTemp = "cold";
export default async (req, res) => {
  const start = Date.now();
  const authHeaders = generateHeaders(
    key,
    "GET",
    "docs",
    "dbs/test/colls/test/docs/test"
  );

  const { headers, body } = await request(
    `${endpoint}dbs/test/colls/test/docs/test`,
    {
      headers: {
        ...authHeaders,
        "x-ms-documentdb-partitionkey": `["test"]`,
        "x-ms-version": "2018-12-31",
      },
    }
  );

  let buffers = [];
  for await (const data of body) {
    buffers.push(data);
  }

  res.status(200).json({
    item: Buffer.concat(buffers).toString("utf8"),
    executionTime: Date.now() - start,
    functionTemp,
  });
  if (functionTemp === "cold") {
    functionTemp = "hot";
  }
};
