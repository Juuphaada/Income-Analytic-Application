import {
    BarChart3, Pencil, Trash2,
} from "lucide-react-native";
import React, { Fragment, useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

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

interface StockRecord {
  id: string
  stock: string
  month: number
  returnRate: number
  shares: number
}

type SortCol = "month" | "returnRate" | "profit"

type TableProps = {
    T: React.ComponentType<React.ComponentProps<typeof Text>>
    fmt: (n: number, d?: number) => string;
    records:StockRecord[];
    openAdd: () => void;
    openEdit:(r: StockRecord) => void;
    year:number;
    MONTHS:string[];
    setSelectedId:React.Dispatch<React.SetStateAction<string | null>>;
    selectedId:string | null;
    setDeleteConfirmId:React.Dispatch<React.SetStateAction<string | null>>;
};

export function Table({ T, fmt, records, openAdd, openEdit, year, MONTHS, setSelectedId, selectedId, setDeleteConfirmId}:TableProps) {

    const [sortCol, setSortCol] = useState<SortCol>("month")
    const [sortDir, setSortDir] = useState<1 | -1>(1)

    const Arrow = ({ col }: { col: SortCol }) =>
    sortCol === col ? (
      <Text style={{ color: GREEN }}>{sortDir === 1 ? " ↑" : " ↓"}</Text>
    ) : (
      <Text style={{ opacity: 0.3 }}> ↕</Text>
    )

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

    const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === 1 ? -1 : 1))
    else {
      setSortCol(col)
      setSortDir(1)
    }
  }

    return(
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
    )
}

const s = StyleSheet.create({
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
  }
})