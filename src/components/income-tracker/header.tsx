import { UiText } from "@/components/ui-text";
import { COLORS, FONTS } from "@/constants/theme";
import { dividendContext } from "@/Context/dividendContext";
import { formContext } from "@/Context/formContext";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react-native";
import { useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View
} from "react-native";

export function Header() {

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
  
  const {year, 
    setYear, 
    setSelectedId, 
    yearBaseline, 
    yearCeiling} = divContext;

  const {openAdd} = fContext;

    return(
        <View style={s.header}>
            <View style={s.headerTop}>
                <View>
                    <UiText style={{ color: COLORS.label, letterSpacing: 3.2, textTransform: "uppercase" }}>
                    Portfolio
                    </UiText>
                    <UiText style={{ fontWeight: "bold", letterSpacing: -0.4 }}>
                    Profit Tracker
                    </UiText>
                </View>
                {year < yearBaseline || year > yearCeiling? 
                  (
                    null
                  ) : (
                    <Pressable
                      onPress={openAdd}
                      style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.7 }]}
                    >
                      <Plus size={13} strokeWidth={2.5} color="#fff" />
                      <UiText style={{ color: "#fff", fontWeight: "bold" }}>ADD</UiText>
                    </Pressable>
                  )
                }
            </View>

                    <View style={s.yearNav}>
                      <Pressable
                        onPress={() => {
                          setYear((y) => y - 1)
                          setSelectedId(null)
                        }}
                        style={{ padding: 4 }}
                      >
                        <ChevronLeft size={16} color={COLORS.muted} />
                      </Pressable>

                        <TextInput
                          value={String(year)}
                          keyboardType="number-pad"
                          onChangeText={(text)=>{
                            if (/^\d{0,4}$/.test(text)) {
                              setYear(Number(text));
                              setSelectedId(null);
                            }
                          }}
                          style={{ fontWeight: "bold", letterSpacing: 3.2 ,
                                    fontFamily: FONTS.mono,
                                    fontSize: 16,
                                    color: COLORS.ink,}}
                        /> 
                      
                      <Pressable
                        onPress={() => {
                          setYear((y) => y + 1)
                          setSelectedId(null)
                        }}
                        style={{ padding: 4 }}
                      >
                        <ChevronRight size={16} color={COLORS.muted} />
                      </Pressable>
                    </View>
            </View>
    )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

    header: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    backgroundColor: COLORS.ink,
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
    borderColor: COLORS.border,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  }
})