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
    openAdd: () => void;
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
    const openAdd = () => {
        setSelectedId(null)
        setForm({ stock: "", month: 1, dividendRate: "", shares: "" })
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
          isNaN(rateNum) || 
          isNaN(sharesNum) || 
          !Number.isFinite(rateNum) ||
          !Number.isSafeInteger(sharesNum) || 
          rateNum < 0 ||
          sharesNum <= 0 ||
          (sharesNum % 1) !== 0
        ) {
          return true;
        }
      return false;
    }

    const previewProfit = useMemo(() => {
        const rate = Number(form.dividendRate);
        const sh = Number(form.shares);

        if (
          checkIsNumInputInvalid(rate,sh)
        ) {
          return null;
        }

        return rate * sh;
      },
      [form.dividendRate, form.shares]
    );

    //form 
    const handleSubmit = async() => {
      if (!formMode) return;
      
      const rate = Number(form.dividendRate)
      const sh = Number(form.shares)

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