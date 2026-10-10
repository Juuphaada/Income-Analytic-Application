import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

import { DeleteConfirmPopup } from "@/components/income-tracker/delete-confirm";
import { Form } from "@/components/income-tracker/form";
import { Header } from "@/components/income-tracker/header";
import { Info } from "@/components/income-tracker/info";
import { Table } from "@/components/income-tracker/table";
/**
 * Dependencies:
 *   npm i lucide-react-native react-native-svg
 *   (Expo: npx expo install react-native-svg)
 *
 * Font: swap MONO for a loaded font (e.g. JetBrainsMono_400Regular via
 * @expo-google-fonts/jetbrains-mono) if you want the exact web look.
 */

interface StockRecord {
  id: string
  stock: string
  month: number
  returnRate: number
  shares: number
}

type YearData = Record<number, StockRecord[]>

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

const SEED: YearData = {
  2023: [
    { id: "a1", stock: "AAPL", month: 1, returnRate: 8.4, shares: 120 },
    { id: "a2", stock: "AAPL", month: 7, returnRate: 3.9, shares: 120 },
    { id: "a3", stock: "MSFT", month: 1, returnRate: 11.2, shares: 85 },
    { id: "a4", stock: "MSFT", month: 8, returnRate: 4.3, shares: 85 },
    { id: "a5", stock: "NVDA", month: 2, returnRate: 34.6, shares: 40 },
    { id: "a6", stock: "NVDA", month: 6, returnRate: 52.1, shares: 40 },
    { id: "a7", stock: "NVDA", month: 12, returnRate: 21.3, shares: 40 },
    { id: "a8", stock: "TSLA", month: 3, returnRate: 12.5, shares: 60 },
    { id: "a9", stock: "TSLA", month: 8, returnRate: 18.7, shares: 60 },
    { id: "a10", stock: "GOOGL", month: 4, returnRate: 6.8, shares: 30 },
    { id: "a11", stock: "GOOGL", month: 10, returnRate: 4.2, shares: 30 },
  ],
  2024: [
    { id: "b1", stock: "AAPL", month: 1, returnRate: 5.2, shares: 150 },
    { id: "b2", stock: "AAPL", month: 7, returnRate: 1.8, shares: 150 },
    { id: "b3", stock: "NVDA", month: 1, returnRate: 24.8, shares: 55 },
    { id: "b4", stock: "NVDA", month: 4, returnRate: 87.3, shares: 55 },
    { id: "b5", stock: "NVDA", month: 8, returnRate: 11.2, shares: 55 },
    { id: "b6", stock: "MSFT", month: 2, returnRate: 8.9, shares: 90 },
    { id: "b7", stock: "MSFT", month: 9, returnRate: 6.7, shares: 90 },
    { id: "b8", stock: "TSLA", month: 2, returnRate: 18.4, shares: 75 },
    { id: "b9", stock: "GOOGL", month: 5, returnRate: 12.6, shares: 35 },
    { id: "b10", stock: "META", month: 6, returnRate: 9.4, shares: 45 },
    { id: "b11", stock: "META", month: 11, returnRate: 14.3, shares: 45 },
  ],
  2025: [
    { id: "c1", stock: "AAPL", month: 1, returnRate: 3.6, shares: 200 },
    { id: "c2", stock: "AAPL", month: 5, returnRate: 4.7, shares: 200 },
    { id: "c3", stock: "NVDA", month: 1, returnRate: 15.4, shares: 70 },
    { id: "c4", stock: "NVDA", month: 6, returnRate: 28.1, shares: 70 },
    { id: "c5", stock: "MSFT", month: 2, returnRate: 5.8, shares: 100 },
    { id: "c6", stock: "MSFT", month: 8, returnRate: 3.1, shares: 100 },
    { id: "c7", stock: "GOOGL", month: 3, returnRate: 9.2, shares: 40 },
    { id: "c8", stock: "GOOGL", month: 9, returnRate: 2.8, shares: 40 },
    { id: "c9", stock: "META", month: 4, returnRate: 6.3, shares: 60 },
    { id: "c10", stock: "META", month: 10, returnRate: 11.6, shares: 60 },
    { id: "c11", stock: "TSLA", month: 7, returnRate: 22.9, shares: 80 },
  ],
}

const uid = () => Math.random().toString(36).slice(2, 10)

// Hermes-safe number formatting (no Intl dependency)
const fmt = (n: number, d = 2) => {
  const [int, dec] = Math.abs(n).toFixed(d).split(".")
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return (n < 0 ? "-" : "") + withCommas + (dec ? "." + dec : "")
}

// ── Theme tokens (light) ──
const GREEN = "#00a854"
const RED = "#d93a3a"
const MUTED = "#a0a0b0"
const LABEL = "#9090a0"
const INK = "#111118"
const BG = "#fafafc" // background
const CARD = "#ffffff" // card
const BORDER = "rgba(0,0,0,0.08)" // border
const MUTED_FG = "#6b6b7b" // muted-foreground

const MONO = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
})

type FormMode = { type: "add" } | { type: "edit"; record: StockRecord }

// Small text wrapper so every Text uses the mono font
const T = ({
  style,
  ...props
}: React.ComponentProps<typeof Text>) => (
  <Text {...props} style={[{ fontFamily: MONO, fontSize: 16, color: INK }, style]} />
)

export default function App() {
  const [year, setYear] = useState(2025)
  const [data, setData] = useState<YearData>(SEED)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<FormMode | null>(null)
  const [form, setForm] = useState({
    stock: "",
    month: 1,
    returnRate: "",
    shares: "",
  })

  const records = data[year] ?? []

  const totalProfit = records.reduce((s, r) => s + r.returnRate * r.shares, 0)
  const gains = records.filter((r) => r.returnRate > 0).length
  const losses = records.filter((r) => r.returnRate < 0).length
  const best = records.length
    ? records.reduce(
        (b, r) => (r.returnRate > b.returnRate ? r : b),
        records[0],
      )
    : null

  const openAdd = () => {
    setSelectedId(null)
    setForm({ stock: "", month: 1, returnRate: "", shares: "" })
    setFormMode({ type: "add" })
  }

  const openEdit = (r: StockRecord) => {
    setForm({
      stock: r.stock,
      month: r.month,
      returnRate: String(r.returnRate),
      shares: String(r.shares),
    })
    setFormMode({ type: "edit", record: r })
  }

  const handleDeleteConfirmed = (id: string) => {
    setData((prev) => ({
      ...prev,
      [year]: (prev[year] ?? []).filter((r) => r.id !== id),
    }))
    setSelectedId(null)
    setDeleteConfirmId(null)
  }

  const handleSubmit = () => {
    const rate = parseFloat(form.returnRate)
    const sh = parseFloat(form.shares)
    if (!form.stock.trim() || isNaN(rate) || isNaN(sh) || rate < 0 || sh <= 0)
      return
    const ticker = form.stock.trim().toUpperCase()
    setData((prev) => {
      const existing = prev[year] ?? []
      if (formMode?.type === "edit") {
        const id = formMode.record.id
        return {
          ...prev,
          [year]: existing.map((r) =>
            r.id === id
              ? {
                  ...r,
                  stock: ticker,
                  month: form.month,
                  returnRate: rate,
                  shares: sh,
                }
              : r,
          ),
        }
      }
      return {
        ...prev,
        [year]: [
          ...existing,
          {
            id: uid(),
            stock: ticker,
            month: form.month,
            returnRate: rate,
            shares: sh,
          },
        ],
      }
    })
    setFormMode(null)
    setSelectedId(null)
  }

  const rateNum = parseFloat(form.returnRate)
  const sharesNum = parseFloat(form.shares)
  const previewProfit =
    form.returnRate && form.shares && !isNaN(rateNum) && !isNaN(sharesNum) && rateNum >= 0
      ? rateNum * sharesNum
      : null

  const deleteTarget = deleteConfirmId
    ? records.find((r) => r.id === deleteConfirmId)
    : null

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />

      <Header T={T} openAdd={openAdd} year={year} setYear={setYear} setSelectedId={setSelectedId}/>

      <Info T={T} totalProfit={totalProfit} fmt={fmt} gains={gains} losses={losses} best={best}/>
      
      <Table 
        T={T} 
        fmt={fmt} 
        records={records} 
        openAdd={openAdd} 
        openEdit={openEdit} 
        year={year} 
        MONTHS={MONTHS}
        setSelectedId={setSelectedId} 
        selectedId={selectedId} 
        setDeleteConfirmId={setDeleteConfirmId}
      />
      
        <DeleteConfirmPopup 
          T={T} 
          deleteConfirmId={deleteConfirmId} 
          deleteTarget={deleteTarget} 
          MONTHS={MONTHS}
          year={year}
          fmt={fmt}
          setDeleteConfirmId={setDeleteConfirmId}
          handleDeleteConfirmed={handleDeleteConfirmed}
        />

      <Form 
        formMode={formMode} 
        T={T} 
        year={year} 
        MONTHS={MONTHS} 
        setFormMode={setFormMode} 
        form={form} 
        setForm={setForm} 
        previewProfit={previewProfit} 
        handleSubmit={handleSubmit}
        fmt={fmt}/>
      
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: INK,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
  },
  yearNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f7",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // Summary
  summary: {
    flexDirection: "row",
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  summaryCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  summaryCellBorder: { borderRightWidth: 1, borderRightColor: BORDER },
  summaryLabel: {
    fontSize: 14,
    color: LABEL,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 4,
  },

  // Table
  thead: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 10,
  },
  th: { fontSize: 14, fontWeight: "500", color: MUTED_FG },
  row: { flexDirection: "row", alignItems: "center" },
  cStock: { flex: 1.15, justifyContent: "center" },
  cMonth: { flex: 0.85, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  cRate: { flex: 1.1, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 8 },
  cShares: { flex: 1.1, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 8 },
  cProfit: { flex: 1.2, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 12 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: "rgba(0,168,84,0.03)",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
    borderWidth: 1,
  },
  actionTxt: { fontWeight: "bold", letterSpacing: 1.6 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 96,
    gap: 12,
  },

  // Delete dialog
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  dialog: {
    width: "100%",
    alignItems: "center",
    gap: 16,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  dialogIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(217,58,58,0.08)",
    borderWidth: 1,
    borderColor: "rgba(217,58,58,0.2)",
  },
  dialogBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 2,
  },

  // Form screen
  formScreen: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    backgroundColor: BG,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaeaee",
  },
  fieldLabel: {
    color: LABEL,
    letterSpacing: 1.9,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  input: {
    fontFamily: MONO,
    fontSize: 16,
    color: INK,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  monthBtn: {
    width: "23.5%",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 2,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  formFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    backgroundColor: CARD,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 2,
    backgroundColor: INK,
  },
})
