import { UiText } from "@/components/ui-text";
import { COLORS } from "@/constants/theme";
import { dividendContext } from '@/Context/dividendContext';
import { fmt } from '@/utils/format';
import { useContext } from 'react';
import {
  StyleSheet,
  View
} from "react-native";

export function Info() {
    //get dividendContext
      const context = useContext(dividendContext);
      if (!context) {
        throw new Error(
          "info must be used within DividendContextProvider"
        );
      }
      const {
        totalProfit,
        best,
      } = context;

    return(
      <View style={s.summary}>
        <View style={[s.summaryCell, s.summaryCellBorder]}>
          <UiText style={s.summaryLabel}>Total</UiText>
          <UiText style={{ fontWeight: "bold", color: totalProfit >= 0 ? COLORS.green : COLORS.red }}>
            {totalProfit >= 0 ? "+" : ""}
            {fmt(totalProfit, 0)}
          </UiText>
        </View>
        
        <View style={s.summaryCell}>
          <UiText style={s.summaryLabel}>Best Rate</UiText>
          <UiText style={{ fontWeight: "bold", color: COLORS.green }}>
            {best ? best.symbol + " " + fmt(best.dividend_rate) : "—"}
          </UiText>
        </View>
      </View>
    )
}

const s = StyleSheet.create({
    summary: {
        flexDirection: "row",
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    summaryCell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    summaryCellBorder: { borderRightWidth: 1, borderRightColor: COLORS.border },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.label,
        textTransform: "uppercase",
        letterSpacing: 1.4,
        marginBottom: 4,
    }
})