const { generateHeaders } = require("cosmos-sign");
const http2 = require("http2");

const [endpoint, key] = process.env.COSMOS_CONNECTION_STRING.split(";").map(
  (part) => part.split(/=(.+)/)[1]
);

const client = http2.connect(endpoint);
let functionTemp = "cold";

export default async (req, res) => {
  if (functionTemp === "cold") {
    functionTemp = "hot";
  }
  const start = Date.now();
  const authHeaders = generateHeaders(
    key,
    "GET",
    "docs",
    "dbs/test/colls/test/docs/test"
  );
  const path = "/dbs/test/colls/test/docs/test";
  const headers = {
    ...authHeaders,
    ":path": path,
    "x-ms-documentdb-partitionkey": `["test"]`,
    "x-ms-version": "2018-12-31",
  };

  const response = await request(headers);
  res
    .status(200)
    .json({ item: response, executionTime: Date.now() - start, functionTemp });
};

function request(headers) {
  return new Promise((resolve, reject) => {
    const req = client.request(headers);

    let data = "";

    req.on("response", (headers, flags) => {
      for (const name in headers) {
        console.log(`${name}: ${headers[name]}`);
      }
    });

    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
    req.end();
  });
}
