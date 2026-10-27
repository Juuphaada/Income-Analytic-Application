import { deleteDividend, getAllDividend } from "@/database/schema";
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DividendRow } from "../interface/dividendInterface";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

interface DividendContextType {
    records: DividendRow[];
    totalProfit: number;
    best: DividendRow|null;
    year: number;
    setYear: React.Dispatch<React.SetStateAction<number>>;
    MONTHS: String[];
    deleteConfirmId:string | null;
    setDeleteConfirmId: React.Dispatch<React.SetStateAction<string | null>>;
    handleDeleteConfirmed:() => void;
    deleteTarget: DividendRow | null | undefined;
    selectedId: string | null;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
    loadInfo : ()=>Promise<void>;
    yearBaseline : number;
    yearCeiling : number;
}

interface DividendProviderProps {
  children: ReactNode;
}

// Create a Context
export const dividendContext = createContext<DividendContextType | undefined>(undefined);

// Create a Provider Component
export const DividendContextProvider = ({ children }:DividendProviderProps) => {
    const yearBaseline : number = 2000;
    const yearCeiling : number = new Date().getFullYear();
    const currentYear : number = new Date().getFullYear();

    const [data, setData] = useState<DividendRow[]>([]);
    const [year, setYear] = useState(currentYear);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    async function loadInfo() {
        setLoading(true);
        const {allDividend} = await getAllDividend();
        setData(allDividend);
        setLoading(false);
    };

    //get record
    useEffect(() => {
        loadInfo().catch(error => {
                        console.error("Failed to load dividends:", error);
                    });
    }, []);

    const records = useMemo(
        () => data.filter(record => record.year === year),
        [data, year]
    );

    const totalProfit = useMemo(
        () => records.reduce(
        (sum, r) => sum + r.dividend_rate * r.shares,
        0
    ),
    [records]
    );

    const best = useMemo(
    () =>
        records.length > 0
        ? records.reduce(
            (b, r) => r.dividend_rate > b.dividend_rate ? r : b,
            records[0]
            )
        : null,
    [records]
    );

    const deleteTarget = useMemo(
        () =>
            deleteConfirmId
            ? records.find(r => r.dividend_id === deleteConfirmId) ?? null
            : null,
        [deleteConfirmId, records]
    );
    
    const handleDeleteConfirmed = async() => {
        try {
            if(deleteConfirmId === null){ 
                console.log("No confirm ID selected for deleting a record")
                return;
            }
            
            await deleteDividend(deleteConfirmId);
            await loadInfo();

            setSelectedId(null);
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete or load dividend:", error);
        }
    }   
    
  return (
    <dividendContext.Provider value={
      {records,
        totalProfit,
        best,
        year,
        setYear,
        MONTHS,
        deleteConfirmId,
        setDeleteConfirmId,
        handleDeleteConfirmed,
        deleteTarget,
        selectedId, 
        setSelectedId,
        loadInfo,
        yearBaseline,
        yearCeiling
    }
    }>
      {children}
    </dividendContext.Provider>
  );
};