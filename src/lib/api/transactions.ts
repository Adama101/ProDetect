// pages/api/transactions.ts
import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/arangodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = `
      FOR t IN transactions
        SORT t._key DESC
        LIMIT 50
        RETURN t
    `;
    const cursor = await db.query(query);
    const result = await cursor.all();

    res.status(200).json(result);
  } catch (err) {
    console.error("ArangoDB query error:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}
