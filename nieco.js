const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const endpoint = "https://mecir-dp.documents.azure.com:443";
const key =
  "NxsPXiOjLPcVPOfqGCSnqqvgKYqEnCPUEzboQ0IXravkd8kfOczuS3lS5RrPuPzRu4uhrd29bj60ACDbAXODwg==";
const SECRET_JWT_KEY = "SECRET_JWT_KEY";
const client = new CosmosClient({ endpoint, key });

const calculateUptimeSlots = (uptimes, applianceIds, timeFrom, timeTo) =>
  applianceIds.map(applianceId => {
    const applianceUptimes = uptimes
      .filter(uptime => uptime.applianceId === applianceId)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((applianceUptime, index, array) => {
        if (index === 0 && !applianceUptime.isPoweredOn) {
          return [timeFrom, applianceUptime.timestamp];
        }
        if (index === array.length - 1 && applianceUptime.isPoweredOn) {
          return [applianceUptime.timestamp, timeTo];
        }
        if (!applianceUptime.isPoweredOn) {
          return [array[index - 1].timestamp, applianceUptime.timestamp];
        }
        return undefined;
      })
      .filter(Boolean);

    return { applianceId, applianceUptimes };
  });

module.exports = async function (context, req) {
  const { database } = await client.databases.createIfNotExists({ id: "Uptime" });
  const { container } = await database.containers.createIfNotExists({ id: "Uptime" });

  // Token auth
  const token = req.body.token;

  if (!token) {
    context.res = {
      status: 403,
      body: "A token is required for authentication",
    };
    return;
  }
  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY);
    user = decoded;
  } catch (err) {
    context.res = {
      status: 401,
      body: "Invalid Token",
    };
    return;
  }

  const { applianceIds, timeFrom, timeTo } = req.body;

  if (!applianceIds || !timeFrom || !timeTo) {
    context.res = {
      status: 400,
      body: JSON.stringify({
        message: "Bad request params",
        uptime: null,
      }),
    };
    return;
  }

  if (!Array.isArray(applianceIds) || applianceIds.length === 0) {
    context.res = {
      status: 200,
      body: JSON.stringify({
        message: "Success",
        uptime: null,
      }),
    };
    return;
  }

  try {
    const { resources } = await container.items
      .query({
        query:
          "SELECT * from Uptime WHERE ARRAY_CONTAINS(@applianceIds, Uptime.applianceId,false) AND Uptime.timestamp >= @timeFrom AND Uptime.timestamp <= @timeTo",
        parameters: [
          { name: "@applianceIds", value: applianceIds },
          { name: "@timeFrom", value: timeFrom },
          { name: "@timeTo", value: timeTo },
        ],
      })
      .fetchAll();

    context.res = {
      body: JSON.stringify({
        message: "Success",
        uptime: calculateUptimeSlots(resources, applianceIds, timeFrom, timeTo),
      }),
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: "Error while fetching uptime: " + error,
    };
  }
};
