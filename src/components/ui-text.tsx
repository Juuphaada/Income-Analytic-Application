import { COLORS, FONTS } from "@/constants/theme";
import { Text, type TextProps } from "react-native";

type UiTextProps = TextProps;

export function UiText({ style, ...props }: UiTextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: FONTS.mono,
          fontSize: 14.9,
          color: COLORS.ink,
          letterSpacing:0
        },
        style,
      ]}
    />
  );
}