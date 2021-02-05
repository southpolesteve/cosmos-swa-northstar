const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const container = client.database("test").container("test");
let functionTemp = "cold";

export default async (req, res) => {
  const start = Date.now();
  const { resource } = await container.item("test", "test").read();
  res
    .status(200)
    .json({ item: resource, executionTime: Date.now() - start, functionTemp });
  if (functionTemp === "cold") {
    functionTemp = "hot";
  }
};
