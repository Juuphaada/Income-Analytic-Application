import { UiText } from "@/components/ui-text";
import { COLORS, FONTS } from "@/constants/theme";
import { dividendContext } from "@/Context/dividendContext";
import { formContext } from "@/Context/formContext";
import { fmt } from '@/utils/format';
import {
    Check,
    X
} from "lucide-react-native";
import { useContext } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from "react-native";

export function Form(){

    const divContext = useContext(dividendContext);
    const fContext = useContext(formContext);
    
    if (!divContext) {
        throw new Error(
        "header must be used within DividendContextProvider"
        );
    };
    if (!fContext) {
        throw new Error(
        "header must be used within FormContextProvider"
        );
    };
    
    const {year,MONTHS} = divContext;
    const {formMode,
        setFormMode,
        form,
        setForm,
        previewProfit,
        handleSubmit} = fContext;

    return(
        <> 
        {formMode && (
            <KeyboardAvoidingView
                style={s.formScreen}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
            <View style={s.formHeader}>
                <View>
                <UiText style={{ color: COLORS.label, letterSpacing: 1.9, textTransform: "uppercase", marginBottom: 2 }}>
                    {formMode.type === "edit" ? "Editing" : "New Entry"} · {year}
                </UiText>
                <UiText style={{ fontWeight: "bold", letterSpacing: -0.4 }}>
                    {formMode.type === "edit"
                    ? `${formMode.record.symbol} — ${MONTHS[formMode.record.month - 1]}`
                    : "Add Record"}
                </UiText>
                </View>
                <Pressable onPress={() => setFormMode(null)} style={s.closeBtn}>
                <X size={15} color={COLORS.mutedForeground} />
                </Pressable>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ gap: 8 }}>
                <UiText style={s.fieldLabel}>Stock Symbol</UiText>
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
                <UiText style={s.fieldLabel}>Month</UiText>
                <View style={s.monthGrid}>
                    {MONTHS.map((m, i) => {
                    const active = form.month === i + 1
                    return (
                        <Pressable
                        key={i}
                        onPress={() => setForm((f) => ({ ...f, month: i + 1 }))}
                        style={[
                            s.monthBtn,
                            { backgroundColor: active ? COLORS.ink : "#eaeaee" },
                        ]}
                        >
                        <UiText
                            style={{
                            fontWeight: "600",
                            letterSpacing: 0.8,
                            color: active ? "#fff" : "#808090",
                            }}
                        >
                            {m}
                        </UiText>
                        </Pressable>
                    )
                    })}
                </View>
                </View>

                <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flex: 1, gap: 8 }}>
                    <UiText style={s.fieldLabel}>Dividend Rate</UiText>
                    <TextInput
                    keyboardType="decimal-pad"
                    placeholder="12.5"
                    placeholderTextColor="rgba(17,17,24,0.4)"
                    value={form.dividendRate}
                    onChangeText={(v) => setForm((f) => ({ ...f, dividendRate: v }))}
                    style={s.input}
                    />
                </View>
                <View style={{ flex: 1, gap: 8 }}>
                    <UiText style={s.fieldLabel}>Share Amount</UiText>
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
                <UiText style={{ fontWeight: "bold", letterSpacing: 0.8, color: COLORS.label }}>
                    RATE × SHARES
                </UiText>
                <UiText
                    style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: previewProfit !== null ? COLORS.green : "#d0d0d8"
                    }}
                >
                    {previewProfit !== null ? fmt(previewProfit, 2) : "—"}
                </UiText>
                </View>
            </ScrollView>

            <View style={s.formFooter}>
                <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [s.submitBtn, pressed && { opacity: 0.7 }]}
                >
                <Check size={15} strokeWidth={2.5} color="#fff" />
                <UiText style={{ fontSize: 14, fontWeight: "bold", letterSpacing: 1.6, color: "#fff" }}>
                    {formMode.type === "edit" ? "UPDATE RECORD" : "SAVE RECORD"}
                </UiText>
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
    backgroundColor: COLORS.background,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    color: COLORS.label,
    letterSpacing: 1.9,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  input: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    color: COLORS.ink,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  formFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 2,
    backgroundColor: COLORS.ink,
  }
})