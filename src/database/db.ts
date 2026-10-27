import * as SQLite from "expo-sqlite";

const DB_NAME = "dividend_tracker_db";
let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS stocks (
      stock_id TEXT PRIMARY KEY NOT NULL,
      symbol TEXT NOT NULL UNIQUE,
      name TEXT
    );
    
    CREATE TABLE IF NOT EXISTS dividends (
      dividend_id TEXT PRIMARY KEY NOT NULL,
      stock_id TEXT NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      date TEXT NOT NULL,
      dividend_rate REAL NOT NULL,
      shares INTEGER NOT NULL,
      tax_rate REAL,
      created TEXT NOT NULL,
      lastmodify TEXT NOT NULL,
      
      FOREIGN KEY (stock_id) REFERENCES stocks(stock_id),

      UNIQUE (stock_id, date, year),

      CHECK (shares > 0),
      CHECK (tax_rate IS NULL OR tax_rate >= 0)
    );
  `);

    console.log("Database path:", db.databasePath);
  }

  return db;
}