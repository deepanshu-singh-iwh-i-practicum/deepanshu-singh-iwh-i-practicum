require("dotenv").config();
const axios = require("axios");

const token = process.env.HUBSPOT_ACCESS_TOKEN;
if (!token) {
  console.error("Missing HUBSPOT_ACCESS_TOKEN. Add it to your .env file first.");
  process.exit(1);
}

const api = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  timeout: 20000
});

async function main() {
  // Create a custom object schema associated with contacts.
  const schema = await api.post("/crm/v3/schemas", {
    name: "digital_marketing_campaign",
    labels: { singular: "Marketing Campaign", plural: "Marketing Campaigns" },
    primaryDisplayProperty: "name",
    requiredProperties: ["name"],
    searchableProperties: ["name", "platform"],
    secondaryDisplayProperties: ["platform", "budget"],
    associatedObjects: ["CONTACT"],
    properties: [
      {
        name: "name",
        label: "Name",
        type: "string",
        fieldType: "text",
        groupName: "marketing_campaign_information"
      },
      {
        name: "platform",
        label: "Platform",
        type: "string",
        fieldType: "text",
        groupName: "marketing_campaign_information"
      },
      {
        name: "budget",
        label: "Budget",
        type: "number",
        fieldType: "number",
        groupName: "marketing_campaign_information"
      }
    ],
    description: "Digital marketing campaigns created for the HubSpot Foundations practicum."
  });

  const objectType = schema.data.objectTypeId || schema.data.name;
  console.log("Custom object created. Object type:", objectType);

  // Add three sample records.
  const examples = [
    { name: "Summer Social Launch", platform: "Instagram", budget: "15000" },
    { name: "Search Growth Campaign", platform: "Google Ads", budget: "25000" },
    { name: "Brand Awareness Drive", platform: "YouTube", budget: "18000" }
  ];

  for (const properties of examples) {
    await api.post(`/crm/v3/objects/${encodeURIComponent(objectType)}`, { properties });
    console.log("Created:", properties.name);
  }

  console.log("\\nAdd this line to your .env file:");
  console.log(`HUBSPOT_OBJECT_TYPE=${objectType}`);
  console.log("\\nIf schema creation reports that the object name already exists, do not repeatedly rerun this script.");
}

main().catch(error => {
  console.error("HubSpot setup failed:");
  console.error(error.response?.data || error.message);
  process.exit(1);
});
