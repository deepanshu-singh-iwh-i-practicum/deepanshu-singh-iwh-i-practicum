require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const OBJECT_TYPE = process.env.HUBSPOT_OBJECT_TYPE;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const hubspot = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  },
  timeout: 15000
});

function requireConfiguration(res) {
  if (!ACCESS_TOKEN || !OBJECT_TYPE) {
    res.status(500).send(
      "HubSpot is not configured. Add HUBSPOT_ACCESS_TOKEN and HUBSPOT_OBJECT_TYPE to your .env file. See README.md."
    );
    return false;
  }
  return true;
}

// 1. Homepage: retrieve all custom object records and display them.
app.get("/", async (req, res) => {
  if (!requireConfiguration(res)) return;

  try {
    const response = await hubspot.post(
      `/crm/v3/objects/${encodeURIComponent(OBJECT_TYPE)}/search`,
      {
        properties: ["name", "platform", "budget"],
        limit: 100,
        sorts: [{ propertyName: "createdate", direction: "DESCENDING" }]
      }
    );

    res.render("homepage", {
      title: "Digital Marketing Campaigns | HubSpot Practicum",
      records: response.data.results || [],
      error: null
    });
  } catch (error) {
    const detail = error.response?.data?.message || error.message;
    res.status(error.response?.status || 500).render("homepage", {
      title: "Digital Marketing Campaigns | HubSpot Practicum",
      records: [],
      error: detail
    });
  }
});

// 2. Show the form for creating a custom object record.
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
  });
});

// 3. Create a custom object record from submitted form data.
app.post("/update-cobj", async (req, res) => {
  if (!requireConfiguration(res)) return;

  const { name, platform, budget } = req.body;
  if (![name, platform, budget].every(value => String(value || "").trim())) {
    return res.status(400).render("updates", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
      error: "Please complete all three fields."
    });
  }

  try {
    await hubspot.post(
      `/crm/v3/objects/${encodeURIComponent(OBJECT_TYPE)}`,
      {
        properties: {
          name: String(name).trim(),
          platform: String(platform).trim(),
          budget: String(budget).trim()
        }
      }
    );
    res.redirect("/");
  } catch (error) {
    res.status(error.response?.status || 500).render("updates", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
      error: error.response?.data?.message || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
