import { UiText } from "@/components/ui-text";
import { COLORS } from "@/constants/theme";
import { dividendContext } from "@/Context/dividendContext";
import { formContext } from "@/Context/formContext";
import { fmt } from '@/utils/format';
import {
  BarChart3, Pencil, Trash2,
} from "lucide-react-native";
import { Fragment, useContext, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DividendRow } from "../../interface/dividendInterface";

type SortCol = "month" | "returnRate" | "profit"

export function Table() {
    //get Contexts
    const divContext = useContext(dividendContext);
    const fContext = useContext(formContext);

    if (!divContext) {
      throw new Error(
        "table must be used within DividendContextProvider"
      );
    };

    if (!fContext) {
      throw new Error(
        "table must be used within FormContextProvider"
      );
    };

    const {records,
      year,
      MONTHS,
      setDeleteConfirmId,
      selectedId,
      setSelectedId,
      yearBaseline,
      yearCeiling} = divContext;

    const {openAdd,openEdit} = fContext;

    // useState
    const [sortCol, setSortCol] = useState<SortCol>("month")
    const [sortDir, setSortDir] = useState<1 | -1>(1)

    const Arrow = ({ col }: { col: SortCol }) =>
      sortCol === col ? (
        <Text style={{ color: COLORS.green, fontWeight: "bold"}}>{sortDir === 1 ? " ↑" : " ↓"}</Text>
      ) : (
        <Text style={{ opacity: 0.3, fontWeight: "bold" }}> ↕</Text>
      )

  //grouping and sorting diplayed records
  const groups = useMemo(() => {

      const map = new Map<string, DividendRow[]>()
      for (const r of records) {
        if (!map.has(r.symbol)) map.set(r.symbol, [])
        map.get(r.symbol)!.push(r)
      }
      for (const [, rows] of map) {
        rows.sort((a, b) => {
          if (sortCol === "returnRate")
            return (a.dividend_rate - b.dividend_rate) * sortDir
          if (sortCol === "profit")
            return (a.dividend_rate * a.shares - b.dividend_rate * b.shares) * sortDir
          return (a.month - b.month) * sortDir
        })
      };

      return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [records, sortCol, sortDir])

  //Set sort columns
  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === 1 ? -1 : 1))
    else {
      setSortCol(col)
      setSortDir(1)
    }
  }

    return(
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {records.length === 0 ? (
          year <= yearBaseline || year > yearCeiling? 
          (
            <View style={s.empty}>
              <UiText style={{ color: COLORS.label }}>Invaild year</UiText>
              <UiText style={{ color: COLORS.label}}>" Year must be in between the defined baseline and the current year ({yearBaseline} - {yearCeiling}) "</UiText>
            </View>
          ) 
          : 
          (
            <View style={s.empty}>
              <BarChart3 size={28} color="#d0d0d8" />
              <UiText style={{ color: COLORS.label }}>No records for {year}</UiText>
              <Pressable onPress={openAdd}>
                <UiText style={{ color: COLORS.green }}>Add first entry →</UiText>
              </Pressable>
            </View>
          )
        ) : (
          <>
            {/* Table head */}
            <View style={s.thead}>
              <View style={[s.cStock, { paddingLeft: 12 }]}>
                <UiText style={s.th}>STOCK</UiText>
              </View>
              <Pressable style={s.cMonth} onPress={() => toggleSort("month")}>
                <UiText style={s.th}>
                  MM
                  <Arrow col="month" />
                </UiText>
              </Pressable>
              <Pressable style={s.cRate} onPress={() => toggleSort("returnRate")}>
                <UiText style={s.th}>
                  RATE
                  <Arrow col="returnRate" />
                </UiText>
              </Pressable>
              <View style={s.cShares}>
                <UiText style={s.th}>SHARES</UiText>
              </View>
              <Pressable style={s.cProfit} onPress={() => toggleSort("profit")}>
                <UiText style={s.th}>
                  R×S
                  <Arrow col="profit" />
                </UiText>
              </Pressable>
            </View>

            <ScrollView>
              {groups.map(([stockName, rows]) =>
                rows.map((r, rowIdx) => {
                  const profit = r.dividend_rate * r.shares;
                  const isFirst = rowIdx === 0;
                  const isLast = rowIdx === rows.length - 1;
                  const isSelected = selectedId === r.dividend_id;

                  const lastBorder = {
                    borderBottomWidth: 2,
                    borderBottomColor: "rgba(0,0,0,0.07)",
                  }
                  const midBorder = {
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,0.05)",
                  }

                  return (
                    <Fragment key={r.dividend_id}>
                      <Pressable
                        onPress={() => setSelectedId(isSelected ? null : r.dividend_id)}
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
                              borderLeftColor: isFirst ? COLORS.ink : "transparent",
                            },
                          ]}
                        >
                          <UiText
                            style={{
                              fontWeight: "bold",
                              letterSpacing: 0.8,
                              color: COLORS.ink
                            }}
                          >
                            {isFirst ? `${stockName}`:""}
                          </UiText>
                        </View>
                        <View style={[s.cMonth, { paddingVertical: 16 }]}>
                          <UiText style={{ color: COLORS.muted }}>{MONTHS[r.month - 1]}</UiText>
                        </View>
                        <View style={[s.cRate, { paddingVertical: 10 }]}>
                          <UiText style={{ color: COLORS.green, fontWeight: "600" }}>
                            {fmt(r.dividend_rate)}
                          </UiText>
                        </View>
                        <View style={[s.cShares, { paddingVertical: 10 }]}>
                          <UiText style={{ color: COLORS.muted }}>{r.shares}</UiText>
                        </View>
                        <View style={[s.cProfit, { paddingVertical: 10 }]}>
                          <UiText style={{ color: COLORS.green, fontWeight: "600" }}>
                            {fmt(profit, 1)}
                          </UiText>
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
                            <Pencil size={10} strokeWidth={2.5} color={COLORS.ink} />
                            <UiText style={s.actionTxt}>EDIT</UiText>
                          </Pressable>
                          <Pressable
                            onPress={() => setDeleteConfirmId(r.dividend_id)}
                            style={({ pressed }) => [
                              s.actionBtn,
                              {
                                backgroundColor: "rgba(217,58,58,0.08)",
                                borderColor: "rgba(217,58,58,0.2)",
                              },
                              pressed && { opacity: 0.7 },
                            ]}
                          >
                            <Trash2 size={10} strokeWidth={2.5} color={COLORS.red} />
                            <UiText style={[s.actionTxt, { color: COLORS.red }]}>DELETE</UiText>
                          </Pressable>
                          <UiText
                            style={{
                              marginLeft: "auto",
                              color: COLORS.label,
                              letterSpacing: 1.6,
                            }}
                          >
                            {MONTHS[r.month - 1].toUpperCase()} {year}
                          </UiText>
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
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 10,
  },
  th: { fontSize: 14, fontWeight: "500", color: COLORS.mutedForeground },
  row: { flexDirection: "row", alignItems: "center" },
  cStock: { flex: 1.15, justifyContent: "center" },
  cMonth: { flex: 0.85, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  cRate: { flex: 1.1, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 8 },
  cShares: { flex: 1.8, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 8 },
  cProfit: { flex: 1.8, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 12 },
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
    paddingHorizontal: 50,
    gap: 12,
  }
})