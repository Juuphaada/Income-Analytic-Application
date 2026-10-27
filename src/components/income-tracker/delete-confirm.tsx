import { UiText } from "@/components/ui-text";
import { COLORS } from "@/constants/theme";
import { dividendContext } from "@/Context/dividendContext";
import { fmt } from '@/utils/format';
import {
  AlertTriangle
} from "lucide-react-native";
import { useContext } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

export function DeleteConfirmPopup() {
  //get Contexts
      const divContext = useContext(dividendContext);
  
      if (!divContext) {
        throw new Error(
          "header must be used within DividendContextProvider"
        );
      };
  
      const {
        year,
        MONTHS,
        setDeleteConfirmId,
        deleteConfirmId,
        handleDeleteConfirmed,
        deleteTarget} = divContext;
    
    return(
      <>
      {deleteConfirmId && deleteTarget && (
        <View style={s.overlay}>
          <View style={s.dialog}>
            <View style={s.dialogIcon}>
              <AlertTriangle size={22} color={COLORS.red} />
            </View>
            <View style={{ alignItems: "center" }}>
              <UiText style={{ fontWeight: "bold", marginBottom: 4 }}>Delete Record?</UiText>
              <UiText style={{ color: COLORS.label }}>This will permanently remove</UiText>
              <UiText style={{ marginTop: 4, fontWeight: "600" }}>
                {deleteTarget.symbol} · {MONTHS[deleteTarget.month - 1]} {year}
              </UiText>
              <UiText style={{ marginTop: 2, color: COLORS.label }}>
                Profit:{" "}
                <Text
                  style={{
                    color:
                      deleteTarget.dividend_rate * deleteTarget.shares >= 0
                        ? COLORS.green
                        : COLORS.red,
                  }}
                >
                  {fmt(deleteTarget.dividend_rate * deleteTarget.shares, 1)}
                </Text>
              </UiText>
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
                <UiText style={{ color: "#808090", fontWeight: "bold", letterSpacing: 1.6 }}>
                  CANCEL
                </UiText>
              </Pressable>
              <Pressable
                onPress={() => handleDeleteConfirmed()}
                style={({ pressed }) => [
                  s.dialogBtn,
                  { backgroundColor: COLORS.red },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <UiText style={{ color: "#fff", fontWeight: "bold", letterSpacing: 1.6 }}>
                  DELETE
                </UiText>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      </>
    )
}

const s = StyleSheet.create({
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
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
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
})