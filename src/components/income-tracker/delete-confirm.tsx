import {
  AlertTriangle
} from "lucide-react-native";
import React from "react";
import {
  Pressable,
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

type deleteConfProps = {
    T: React.ComponentType<React.ComponentProps<typeof Text>>
    deleteConfirmId:  string | null;
    deleteTarget:StockRecord | null | undefined;
    MONTHS:string[];
    year:number;
    fmt: (n: number, d?: number) => string;
    setDeleteConfirmId: React.Dispatch<React.SetStateAction<string | null>>;
    handleDeleteConfirmed: (id: string) => void;
};

export function DeleteConfirmPopup({T, deleteConfirmId, deleteTarget, MONTHS, year, fmt, setDeleteConfirmId, handleDeleteConfirmed}:deleteConfProps) {
    
    return(
      <>
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
})