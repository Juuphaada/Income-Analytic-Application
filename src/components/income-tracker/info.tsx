import {
    StyleSheet,
    Text,
    View
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

type InfoProps = {
    T: React.ComponentType<React.ComponentProps<typeof Text>>
    totalProfit: number;
    fmt: (n: number, d?: number) => string;
    gains: number;
    losses: number;
    best: StockRecord | null
};

export function Info({ T, totalProfit, fmt, gains, losses, best}:InfoProps) {
    

    return(
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
    )
}

const s = StyleSheet.create({
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
    }
})