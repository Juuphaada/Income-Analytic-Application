export interface DividendRow {
  dividend_id: string;
  stock_id: string;
  symbol: string;
  name: string | null;
  month: number;
  year: number;
  date: string;
  dividend_rate: number;
  shares: number;
  tax_rate: number | null;
  created: string;
  lastmodify: string;
}

export interface DividendListResult {
  allDividend: DividendRow[];
  total: number;
}