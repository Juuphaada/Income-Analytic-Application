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
          fontSize: 16,
          color: COLORS.ink,
        },
        style,
      ]}
    />
  );
}