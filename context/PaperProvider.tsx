import React, { PropsWithChildren } from "react";
import { Colors } from "@/constants";
import { MD3DarkTheme, MD3LightTheme, PaperProvider as Provider } from "react-native-paper";
import merge from "deepmerge";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useAppTheme } from "@/hooks";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const CombinedLightTheme = merge(DefaultTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function PaperProvider({ children }: PropsWithChildren) {
	const { colorScheme } = useAppTheme();

	const theme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

	return (
		<Provider theme={theme}>
			<ThemeProvider value={theme}>{children}</ThemeProvider>
		</Provider>
	);
}
