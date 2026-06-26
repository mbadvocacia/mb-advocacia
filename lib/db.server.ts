import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/db/schema";

let db: any = null;

export function getDb() {
  if (!db) {
    const pool = mysql.createPool({
      uri: process.env.DATABASE_URL || "",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    db = drizzle(pool, { schema, mode: "default" });
  }

  return db;
}

export { schema };
