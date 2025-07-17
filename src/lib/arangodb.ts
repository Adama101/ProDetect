// lib/arango.ts
import { Database } from "arangojs";

const db = new Database({
  url: "http://ec2-13-50-232-194.eu-north-1.compute.amazonaws.com/:18529", // Replace with actual IP/port
  databaseName: "evaluationResults",
  auth: { username: "root", password: "your_password" },
});

export const transactions = db.collection("transactions");
export default db;
