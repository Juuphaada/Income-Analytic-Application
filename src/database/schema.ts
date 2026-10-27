import { DividendListResult, DividendRow } from "../interface/dividendInterface";
import StockRow from "../interface/stocksInterface";
import { getDB } from "./db";
const Crypto = require('expo-crypto');

async function createStock(symbol: string): Promise<string | null>{
  const db = await getDB();

  const existStock = await getStock(symbol);

  if(existStock !== null){
    return "Stock alredy exist";
  }

  const stockId = Crypto.randomUUID();

  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    throw new Error("Stock symbol is required");
  }

  const inseartResult = await db.runAsync(
    `INSERT INTO stocks (stock_id, symbol, name)
     VALUES (?, ?, NULL)`,
    stockId,
    normalizedSymbol
  );

  const newStock = await getStock(symbol);

  if (!newStock) {
    throw new Error("Failed to create stock");
  }

  return null;
};

async function getStock(symbol: string): Promise<StockRow|null> {
  const db = await getDB();

  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    throw new Error("Stock symbol is required");
  }

  const stock = await db.getFirstAsync<StockRow>(
    `SELECT stock_id, symbol, name
     FROM stocks
     WHERE symbol = ?`,
    normalizedSymbol
  );

  return stock;
};

async function deleteStock(delete_stock_id: string){
  const db = await getDB();

  const deleteResult = await db.runAsync(
    `DELETE FROM stocks
     WHERE stock_id = ?`,
     delete_stock_id
  );

  if (deleteResult.changes === 0) {
    throw new Error("Stock record not found");
  }

  return deleteResult;
};

export async function addDividend (
  inserted_symbol:string, 
  inserted_month:number ,
  inserted_year:number, 
  inserted_dividendRate:number, 
  insert_shares:number, 
  inserted_tax?:number
) {

  if (!Number.isFinite(inserted_dividendRate) || inserted_dividendRate < 0) {
    throw new Error("Invalid dividend rate");
  }

  if (!Number.isSafeInteger(insert_shares) || insert_shares <= 0) {
    throw new Error("Shares must be a positive integer");
  }

  if (
    inserted_tax !== undefined &&
    (!Number.isFinite(inserted_tax) || inserted_tax < 0)
  ) {
    throw new Error("Invalid tax");
  }

  await createStock(inserted_symbol);
  const stock = await getStock(inserted_symbol);

  if(stock === null){
    throw new Error("Getting stock faild during adding the dividend record");
  }

  const now = new Date().toISOString();
  const dividendId = Crypto.randomUUID();
  const dividendDate = String(inserted_year).padStart(4, '0') + 
                        "-" + String(inserted_month).padStart(2, '0') + 
                        "-" + String(1).padStart(2, '0') +
                        " " + "00:00:00";

  const db = await getDB();

  const saveResult = await db.runAsync(`
    INSERT INTO dividends (
      dividend_id,
      stock_id,
      month,
      year,
      date,
      dividend_rate,
      shares,
      tax_rate,
      created,
      lastmodify
    ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [dividendId, stock.stock_id, inserted_month, inserted_year, dividendDate , inserted_dividendRate, insert_shares, inserted_tax ?? null, now, now]
  );
  
  return saveResult.changes;
};

export async function getAllDividend(): Promise<DividendListResult> {
  const db = await getDB();

  const allDividend = await db.getAllAsync<DividendRow>(
    `SELECT
       d.dividend_id,
       d.stock_id,
       s.symbol,
       s.name,
       d.month,
       d.year,
       d.date,
       d.dividend_rate,
       d.shares,
       d.tax_rate,
       d.created,
       d.lastmodify
     FROM dividends AS d
     INNER JOIN stocks AS s
       ON d.stock_id = s.stock_id`
  );

  const countResult  = await db.getFirstAsync<{ total: number}>(
    `SELECT COUNT(*) AS total
     FROM dividends`
  );

  return {
    allDividend : allDividend,
    total: countResult?.total ?? 0,
  };
};

export async function modifyDividend(
  dividend_id:string, 
  inserted_symbol:string, 
  inserted_month:number, 
  dividend_year:number,
  inserted_dividendRate:number, 
  insert_shares:number,
  inserted_tax?:number
) {

  if (!Number.isFinite(inserted_dividendRate) || inserted_dividendRate < 0) {
    throw new Error("Invalid dividend rate");
  }

  if (!Number.isSafeInteger(insert_shares) || insert_shares <= 0) {
    throw new Error("Shares must be a positive integer");
  }

  if (
    inserted_tax !== undefined &&
    (!Number.isFinite(inserted_tax) || inserted_tax < 0)
  ) {
    throw new Error("Invalid tax");
  }
  
  await createStock(inserted_symbol);
  const stock = await getStock(inserted_symbol);

  if(stock === null){
    throw new Error("Getting stock faild during adding the dividend record");
  }

  const modifyTime = new Date().toISOString();
  const dividendDate = String(dividend_year).padStart(4, '0') + 
                        "-" + String(inserted_month).padStart(2, '0') + 
                        "-" + String(1).padStart(2, '0') +
                        " " + "00:00:00";

  const db = await getDB();

  const editResult = await db.runAsync(
    `UPDATE dividends
     SET
       stock_id = ?,
       month = ?,
       date = ?,
       dividend_rate = ?,
       shares = ?,
       tax_rate = ?,
       lastmodify = ?
     WHERE dividend_id = ?`,
    stock.stock_id,
    inserted_month,
    dividendDate,
    inserted_dividendRate,
    insert_shares,
    inserted_tax ?? null,
    modifyTime,
    dividend_id
  );

  if (editResult.changes === 0) {
    throw new Error("Dividend record not found");
  }

  return editResult;
};

export async function deleteDividend(dividend_id:string) {
  const db = await getDB();

  //get stock ID of the selected dividend for deletion
  const stock_id = await db.getFirstAsync<string>(
    `SELECT stock_id
     FROM dividends
     WHERE dividend_id = ?`,
     dividend_id
  );

  if (stock_id === null || stock_id === "") {
    throw new Error("Can't get stock ID of the selected dividend for deletion");
  }

  //Get number of dividend records containing the stock same to the selected dividend.
  const countResult = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count
     FROM dividends
     WHERE stock_id = ?`,
     stock_id
  );

  if (countResult === null) {
    throw new Error("Failed to count select records containing the specified stock");
  }

  //delete the selected dividend
  const deleteResult = await db.runAsync(
    `DELETE FROM dividends
     WHERE dividend_id = ?`,
    dividend_id
  );

  if (deleteResult.changes === 0) {
    throw new Error("Dividend record not found");
  }

  //Delete the stock data. If the deleted dividend is the last record containing this stock.
  if(countResult.count === 1){
    await deleteStock(stock_id)
  }

  return deleteResult;
};

