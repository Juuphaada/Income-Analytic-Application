import {
    ChevronLeft,
    ChevronRight,
    Plus,
} from "lucide-react-native"
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"

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

type HeaderProps = {
  T: React.ComponentType<React.ComponentProps<typeof Text>>;
  openAdd: () => void;
  year:number;
  setYear:React.Dispatch<React.SetStateAction<number>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
};

export function Header({ T, openAdd , year, setYear, setSelectedId }:HeaderProps) {

    return(
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
    )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

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
  }
})