import { Pool, PoolClient } from "pg";

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "prodetect",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on("connect", (client: PoolClient) => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;

// Helper function to get a client from the pool
export const getClient = () => pool.connect();

// Helper function to run a query
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Helper function to run a transaction
export const transaction = async (
  callback: (client: PoolClient) => Promise<any>
) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};



