import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import RootProvider from "@/context";
import { useAppTheme } from "@/hooks";

const screensDetails = [
	{
		name: "(bottomTabs)",
		options: {},
	},
	{
		name: "(taskDetails)",
		options: {
			headerShown: true,
			headerBackTitle: "back",
			headerTitle: "",
		},
	},
];

export default function RootLayout() {
	const { colorScheme } = useAppTheme();

	return (
		<RootProvider>
			<SafeAreaProvider>
				<StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					{screensDetails.map(({ name, options }) => (
						<Stack.Screen key={name} name={name} options={options} />
					))}
				</Stack>
			</SafeAreaProvider>
		</RootProvider>
	);
}
