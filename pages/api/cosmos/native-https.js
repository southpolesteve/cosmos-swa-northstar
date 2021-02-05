const { generateHeaders } = require("cosmos-sign");
const https = require("https");

const [endpoint, key] = process.env.COSMOS_CONNECTION_STRING.split(";").map(
  (part) => part.split(/=(.+)/)[1]
);

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
  const options = {
    hostname: endpoint.split("https://")[1].split(":")[0],
    path: "/dbs/test/colls/test/docs/test",
    method: "GET",
    headers: {
      ...authHeaders,
      "x-ms-documentdb-partitionkey": `["test"]`,
      "x-ms-version": "2018-12-31",
    },
  };

  const response = await request(options);
  res
    .status(200)
    .json({ item: response, executionTime: Date.now() - start, functionTemp });
};

function request(options) {
  return new Promise((resolve, reject) => {
    const request = https.request(options, function (res) {
      res.setEncoding("utf8");
      let body = "";

      res.on("data", function (chunk) {
        body = body + chunk;
      });

      res.on("end", function () {
        if (res.statusCode != 200) {
          reject(body);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
    request.end();
  });
}
