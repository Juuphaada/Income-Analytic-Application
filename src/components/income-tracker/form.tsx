import {
    Check,
    X
} from "lucide-react-native";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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

const MONO = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
})

interface StockRecord {
  id: string
  stock: string
  month: number
  returnRate: number
  shares: number
}

type FormMode = { type: "add" } | { type: "edit"; record: StockRecord }

type FormProps = {
    formMode: FormMode | null;
    T: React.ComponentType<React.ComponentProps<typeof Text>>
    year:number;
    MONTHS:string[];
    setFormMode: React.Dispatch<React.SetStateAction<FormMode | null>>;
    form: {
        stock: string;
        month: number;
        returnRate: string;
        shares: string;
    };
    setForm: React.Dispatch<React.SetStateAction<{
        stock: string;
        month: number;
        returnRate: string;
        shares: string;
    }>>;
    previewProfit: number | null;
    handleSubmit: () => void;
    fmt: (n: number, d?: number) => string;
};

export function Form({formMode, T, year, MONTHS, setFormMode, form, setForm, previewProfit, handleSubmit, fmt}:FormProps){
    return(
        <> 
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
        </>
    )
}

const s = StyleSheet.create({
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
  }
})