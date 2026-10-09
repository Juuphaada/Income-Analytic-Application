import {
  AlertTriangle,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react-native"
import React, { Fragment, useMemo, useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"

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
type SortCol = "month" | "returnRate" | "profit"

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
  const [sortCol, setSortCol] = useState<SortCol>("month")
  const [sortDir, setSortDir] = useState<1 | -1>(1)

  const records = data[year] ?? []

  const groups = useMemo(() => {
    const map = new Map<string, StockRecord[]>()
    for (const r of records) {
      if (!map.has(r.stock)) map.set(r.stock, [])
      map.get(r.stock)!.push(r)
    }
    for (const [, rows] of map) {
      rows.sort((a, b) => {
        if (sortCol === "returnRate")
          return (a.returnRate - b.returnRate) * sortDir
        if (sortCol === "profit")
          return (a.returnRate * a.shares - b.returnRate * b.shares) * sortDir
        return (a.month - b.month) * sortDir
      })
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [records, sortCol, sortDir])

  const totalProfit = records.reduce((s, r) => s + r.returnRate * r.shares, 0)
  const gains = records.filter((r) => r.returnRate > 0).length
  const losses = records.filter((r) => r.returnRate < 0).length
  const best = records.length
    ? records.reduce(
        (b, r) => (r.returnRate > b.returnRate ? r : b),
        records[0],
      )
    : null

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === 1 ? -1 : 1))
    else {
      setSortCol(col)
      setSortDir(1)
    }
  }

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

  const Arrow = ({ col }: { col: SortCol }) =>
    sortCol === col ? (
      <Text style={{ color: GREEN }}>{sortDir === 1 ? " ↑" : " ↓"}</Text>
    ) : (
      <Text style={{ opacity: 0.3 }}> ↕</Text>
    )

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

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <T style={{ color: LABEL, letterSpacing: 3.2, textTransform: "uppercase" }}>
              Portfolio
            </T>
            <T style={{ fontWeight: "bold", letterSpacing: -0.4 }}>
              Profit Tracker
            </T>
          </View>
          <Pressable
            onPress={openAdd}
            style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.7 }]}
          >
            <Plus size={13} strokeWidth={2.5} color="#fff" />
            <T style={{ color: "#fff", fontWeight: "bold" }}>ADD</T>
          </Pressable>
        </View>

        {/* Year nav */}
        <View style={s.yearNav}>
          <Pressable
            onPress={() => {
              setYear((y) => y - 1)
              setSelectedId(null)
            }}
            style={{ padding: 4 }}
          >
            <ChevronLeft size={16} color={MUTED} />
          </Pressable>
          <T style={{ fontWeight: "bold", letterSpacing: 3.2 }}>{year}</T>
          <Pressable
            onPress={() => {
              setYear((y) => y + 1)
              setSelectedId(null)
            }}
            style={{ padding: 4 }}
          >
            <ChevronRight size={16} color={MUTED} />
          </Pressable>
        </View>
      </View>

      {/* ── Summary strip ── */}
      <View style={s.summary}>
        <View style={[s.summaryCell, s.summaryCellBorder]}>
          <T style={s.summaryLabel}>Total Profit</T>
          <T style={{ fontWeight: "bold", color: totalProfit >= 0 ? GREEN : RED }}>
            {totalProfit >= 0 ? "+" : ""}
            {fmt(totalProfit, 0)}
          </T>
        </View>
        <View style={[s.summaryCell, s.summaryCellBorder]}>
          <T style={s.summaryLabel}>Win / Loss</T>
          <T style={{ fontWeight: "bold" }}>
            <Text style={{ color: GREEN }}>{gains}</Text>
            <Text style={{ color: MUTED }}> / </Text>
            <Text style={{ color: RED }}>{losses}</Text>
          </T>
        </View>
        <View style={s.summaryCell}>
          <T style={s.summaryLabel}>Best Rate</T>
          <T style={{ fontWeight: "bold", color: GREEN }}>
            {best ? fmt(best.returnRate) : "—"}
          </T>
        </View>
      </View>

      {/* ── Table ── */}
      <View style={{ flex: 1, backgroundColor: BG }}>
        {records.length === 0 ? (
          <View style={s.empty}>
            <BarChart3 size={28} color="#d0d0d8" />
            <T style={{ color: LABEL }}>No records for {year}</T>
            <Pressable onPress={openAdd}>
              <T style={{ color: GREEN }}>Add first entry →</T>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Table head */}
            <View style={s.thead}>
              <View style={[s.cStock, { paddingLeft: 12 }]}>
                <T style={s.th}>STOCK</T>
              </View>
              <Pressable style={s.cMonth} onPress={() => toggleSort("month")}>
                <T style={s.th}>
                  MM
                  <Arrow col="month" />
                </T>
              </Pressable>
              <Pressable style={s.cRate} onPress={() => toggleSort("returnRate")}>
                <T style={s.th}>
                  RATE
                  <Arrow col="returnRate" />
                </T>
              </Pressable>
              <View style={s.cShares}>
                <T style={s.th}>SHARES</T>
              </View>
              <Pressable style={s.cProfit} onPress={() => toggleSort("profit")}>
                <T style={s.th}>
                  R×S
                  <Arrow col="profit" />
                </T>
              </Pressable>
            </View>

            <ScrollView>
              {groups.map(([stockName, rows]) =>
                rows.map((r, rowIdx) => {
                  const profit = r.returnRate * r.shares
                  const isFirst = rowIdx === 0
                  const isLast = rowIdx === rows.length - 1
                  const isSelected = selectedId === r.id

                  const lastBorder = {
                    borderBottomWidth: 2,
                    borderBottomColor: "rgba(0,0,0,0.07)",
                  }
                  const midBorder = {
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,0.05)",
                  }

                  return (
                    <Fragment key={r.id}>
                      <Pressable
                        onPress={() => setSelectedId(isSelected ? null : r.id)}
                        style={[
                          s.row,
                          {
                            backgroundColor: isSelected
                              ? "rgba(0,168,84,0.06)"
                              : "transparent",
                          },
                          !isSelected && (isLast ? lastBorder : midBorder),
                        ]}
                      >
                        <View
                          style={[
                            s.cStock,
                            {
                              paddingLeft: 12,
                              paddingVertical: 10,
                              borderLeftWidth: 2,
                              borderLeftColor: isFirst ? INK : "transparent",
                            },
                          ]}
                        >
                          <T
                            style={{
                              fontWeight: "bold",
                              letterSpacing: 0.8,
                              color: isFirst ? INK : "transparent",
                            }}
                          >
                            {stockName}
                          </T>
                        </View>
                        <View style={[s.cMonth, { paddingVertical: 16 }]}>
                          <T style={{ color: MUTED }}>{MONTHS[r.month - 1]}</T>
                        </View>
                        <View style={[s.cRate, { paddingVertical: 10 }]}>
                          <T style={{ color: GREEN, fontWeight: "600" }}>
                            {fmt(r.returnRate)}
                          </T>
                        </View>
                        <View style={[s.cShares, { paddingVertical: 10 }]}>
                          <T style={{ color: MUTED }}>{r.shares}</T>
                        </View>
                        <View style={[s.cProfit, { paddingVertical: 10 }]}>
                          <T style={{ color: GREEN, fontWeight: "600" }}>
                            {fmt(profit, 1)}
                          </T>
                        </View>
                      </Pressable>

                      {/* Expanded action row */}
                      {isSelected && (
                        <View
                          style={[
                            s.actionRow,
                            isLast ? lastBorder : midBorder,
                          ]}
                        >
                          <Pressable
                            onPress={() => openEdit(r)}
                            style={({ pressed }) => [
                              s.actionBtn,
                              {
                                backgroundColor: "#f0f0f4",
                                borderColor: "rgba(0,0,0,0.1)",
                              },
                              pressed && { opacity: 0.7 },
                            ]}
                          >
                            <Pencil size={10} strokeWidth={2.5} color={INK} />
                            <T style={s.actionTxt}>EDIT</T>
                          </Pressable>
                          <Pressable
                            onPress={() => setDeleteConfirmId(r.id)}
                            style={({ pressed }) => [
                              s.actionBtn,
                              {
                                backgroundColor: "rgba(217,58,58,0.08)",
                                borderColor: "rgba(217,58,58,0.2)",
                              },
                              pressed && { opacity: 0.7 },
                            ]}
                          >
                            <Trash2 size={10} strokeWidth={2.5} color={RED} />
                            <T style={[s.actionTxt, { color: RED }]}>DELETE</T>
                          </Pressable>
                          <T
                            style={{
                              marginLeft: "auto",
                              color: LABEL,
                              letterSpacing: 1.6,
                            }}
                          >
                            {MONTHS[r.month - 1].toUpperCase()} {year}
                          </T>
                        </View>
                      )}
                    </Fragment>
                  )
                }),
              )}
            </ScrollView>
          </>
        )}
      </View>

      {/* ── Delete confirmation ── */}
      {deleteConfirmId && deleteTarget && (
        <View style={s.overlay}>
          <View style={s.dialog}>
            <View style={s.dialogIcon}>
              <AlertTriangle size={22} color={RED} />
            </View>
            <View style={{ alignItems: "center" }}>
              <T style={{ fontWeight: "bold", marginBottom: 4 }}>Delete Record?</T>
              <T style={{ color: LABEL }}>This will permanently remove</T>
              <T style={{ marginTop: 4, fontWeight: "600" }}>
                {deleteTarget.stock} · {MONTHS[deleteTarget.month - 1]} {year}
              </T>
              <T style={{ marginTop: 2, color: LABEL }}>
                Profit:{" "}
                <Text
                  style={{
                    color:
                      deleteTarget.returnRate * deleteTarget.shares >= 0
                        ? GREEN
                        : RED,
                  }}
                >
                  {fmt(deleteTarget.returnRate * deleteTarget.shares, 1)}
                </Text>
              </T>
            </View>
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <Pressable
                onPress={() => setDeleteConfirmId(null)}
                style={({ pressed }) => [
                  s.dialogBtn,
                  {
                    backgroundColor: "#eaeaee",
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.08)",
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <T style={{ color: "#808090", fontWeight: "bold", letterSpacing: 1.6 }}>
                  CANCEL
                </T>
              </Pressable>
              <Pressable
                onPress={() => handleDeleteConfirmed(deleteConfirmId)}
                style={({ pressed }) => [
                  s.dialogBtn,
                  { backgroundColor: RED },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <T style={{ color: "#fff", fontWeight: "bold", letterSpacing: 1.6 }}>
                  DELETE
                </T>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ── Full-screen Add / Edit form ── */}
      {formMode && (
        <KeyboardAvoidingView
          style={s.formScreen}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={s.formHeader}>
            <View>
              <T style={{ color: LABEL, letterSpacing: 1.9, textTransform: "uppercase", marginBottom: 2 }}>
                {formMode.type === "edit" ? "Editing" : "New Entry"} · {year}
              </T>
              <T style={{ fontWeight: "bold", letterSpacing: -0.4 }}>
                {formMode.type === "edit"
                  ? `${formMode.record.stock} — ${MONTHS[formMode.record.month - 1]}`
                  : "Add Record"}
              </T>
            </View>
            <Pressable onPress={() => setFormMode(null)} style={s.closeBtn}>
              <X size={15} color={MUTED_FG} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ gap: 8 }}>
              <T style={s.fieldLabel}>Stock Symbol</T>
              <TextInput
                placeholder="e.g. AAPL"
                placeholderTextColor="rgba(17,17,24,0.4)"
                value={form.stock}
                autoCapitalize="characters"
                autoCorrect={false}
                onChangeText={(v) => setForm((f) => ({ ...f, stock: v }))}
                style={[s.input, { fontWeight: "bold", letterSpacing: 1.6, textTransform: "uppercase" }]}
              />
            </View>

            <View style={{ gap: 8 }}>
              <T style={s.fieldLabel}>Month</T>
              <View style={s.monthGrid}>
                {MONTHS.map((m, i) => {
                  const active = form.month === i + 1
                  return (
                    <Pressable
                      key={i}
                      onPress={() => setForm((f) => ({ ...f, month: i + 1 }))}
                      style={[
                        s.monthBtn,
                        { backgroundColor: active ? INK : "#eaeaee" },
                      ]}
                    >
                      <T
                        style={{
                          fontWeight: "600",
                          letterSpacing: 0.8,
                          color: active ? "#fff" : "#808090",
                        }}
                      >
                        {m}
                      </T>
                    </Pressable>
                  )
                })}
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={{ flex: 1, gap: 8 }}>
                <T style={s.fieldLabel}>Dividend Rate</T>
                <TextInput
                  keyboardType="decimal-pad"
                  placeholder="12.5"
                  placeholderTextColor="rgba(17,17,24,0.4)"
                  value={form.returnRate}
                  onChangeText={(v) => setForm((f) => ({ ...f, returnRate: v }))}
                  style={s.input}
                />
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                <T style={s.fieldLabel}>Share Amount</T>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="100"
                  placeholderTextColor="rgba(17,17,24,0.4)"
                  value={form.shares}
                  onChangeText={(v) => setForm((f) => ({ ...f, shares: v }))}
                  style={s.input}
                />
              </View>
            </View>

            {/* Preview */}
            <View
              style={[
                s.preview,
                {
                  borderColor:
                    previewProfit !== null
                      ? "rgba(0,168,84,0.25)"
                      : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              <T style={{ fontWeight: "bold", letterSpacing: 0.8, color: LABEL }}>
                RATE × SHARES
              </T>
              <T
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: previewProfit !== null ? GREEN : "#d0d0d8",
                }}
              >
                {previewProfit !== null ? fmt(previewProfit, 2) : "—"}
              </T>
            </View>
          </ScrollView>

          <View style={s.formFooter}>
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [s.submitBtn, pressed && { opacity: 0.7 }]}
            >
              <Check size={15} strokeWidth={2.5} color="#fff" />
              <T style={{ fontSize: 14, fontWeight: "bold", letterSpacing: 1.6, color: "#fff" }}>
                {formMode.type === "edit" ? "UPDATE RECORD" : "SAVE RECORD"}
              </T>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
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
