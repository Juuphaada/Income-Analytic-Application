import { dividendContext } from "@/Context/dividendContext";
import { addDividend, modifyDividend } from "@/database/schema";
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { DividendRow } from "../interface/dividendInterface";

export const formContext = createContext<FormContextType | undefined>(undefined);

interface FormContextType {
    formMode: FormMode | null;
    setFormMode: React.Dispatch<React.SetStateAction<FormMode | null>>;
    form: {
      stock: string;
      month: number;
      dividendRate: string;
      shares: string;
    };
    setForm: React.Dispatch<React.SetStateAction<{
      stock: string;
      month: number;
      dividendRate: string;
      shares: string;
    }>>
    openAdd: (stockSymbol?:string) => void;
    openEdit: (r: DividendRow) => void;
    previewProfit: number | null;
    handleSubmit: () => void;
}

interface FormProviderProps {
  children: ReactNode;
}

type FormMode = { type: "add" } | { type: "edit"; record: DividendRow }

export const FormContextProvider = ({ children }:FormProviderProps) => {
  //get dividendContext
    const divContext = useContext(dividendContext);
    if (!divContext) {
      throw new Error(
        "DividendScreen must be used within DividendContextProvider"
      );
    }
    const {year,
          setSelectedId,
          loadInfo} = divContext;
    
    const [formMode, setFormMode] = useState<FormMode | null>(null)
    const [form, setForm] = useState({
        stock: "",
        month: 1,
        dividendRate: "",
        shares: "",
    })

    //Add record
    const openAdd = (stockSymbol?: string) => {
        setSelectedId(null)
        setForm({ stock: stockSymbol === undefined ?"":stockSymbol , month: 1, dividendRate: "", shares: "" })
        setFormMode({ type: "add" })
    }   
    
    //Edit record 
    const openEdit = (r: DividendRow) => {
        setForm({
            stock: r.symbol,
            month: r.month,
            dividendRate: String(r.dividend_rate),
            shares: String(r.shares),
        })
        setFormMode({ type: "edit", record: r })
    }

    function checkIsNumInputInvalid(rateNum:number,sharesNum:number) {
      if (
          isNaN(sharesNum) || isNaN(rateNum) || 
          !Number.isFinite(sharesNum) || !Number.isFinite(rateNum) ||
          sharesNum > 1000000000 || rateNum > 1000000000 ||
          sharesNum <= 0 || rateNum <= 0 ||
          rateNum *sharesNum > Number.MAX_SAFE_INTEGER
        ) {
          return true;
        }
      return false;
    }

    const previewProfit = useMemo(() => {
        const rate = Number(Number(form.dividendRate).toFixed(6))
        const sh = Number(Number(form.shares).toFixed(6))

        if (
          checkIsNumInputInvalid(rate,sh)
        ) {
          return null;
        }

        return Number((rate * sh).toFixed(2));
      },
      [form.dividendRate, form.shares]
    );

    //form 
    const handleSubmit = async() => {
      if (!formMode) return;
      
      const rate = Number(Number(form.dividendRate).toFixed(6))
      const sh = Number(Number(form.shares).toFixed(6))

      if (!form.stock.trim() || checkIsNumInputInvalid(rate,sh))
      return;

      try{

        if (formMode?.type === "add") {
          await addDividend(
            form.stock, 
            form.month,
            year, 
            rate, 
            sh, 
            0
          );
        };

        if (formMode?.type === "edit") {
          const id = formMode.record.dividend_id
          await modifyDividend(
            id,
            form.stock,
            form.month,
            formMode.record.year,
            rate, 
            sh, 
            0
          );
        };

        await loadInfo();
      
        setFormMode(null);
        setSelectedId(null);
        
      } catch (error) {
          console.error("Failed to add or edit dividend:", error);
      }
        
    }

    return (
    <formContext.Provider value={{
      formMode,
      setFormMode,
      form,
      setForm,
      openAdd,
      openEdit,
      previewProfit,
      handleSubmit
    }}>
      {children}
    </formContext.Provider>
  );
}