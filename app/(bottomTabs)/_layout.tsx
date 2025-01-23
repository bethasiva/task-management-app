import React, { PropsWithChildren } from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from "react-native";
import { impactAsync } from "expo-haptics";
import { ParamListBase, RouteProp } from "@react-navigation/native";

type VectorIconName = React.ComponentProps<typeof Ionicons | typeof MaterialCommunityIcons>["name"];

const screensDetails = [
	{
		name: "task-creation",
		options: {
			title: "Create",
		},
	},
	{
		name: "all-tasks",
		options: {
			title: "All tasks",
		},
	},
	{
		name: "recently-deleted",
		options: {
			title: "Recently Deleted",
		},
	},
];

export default function _layout() {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarIcon: (params) => <TabBarIcon iconParams={params} route={route} />,
				tabBarButton: TabBarButton,
			})}
		>
			{screensDetails.map(({ name, options }) => (
				<Tabs.Screen key={name} name={name} options={options} />
			))}
		</Tabs>
	);
}

const TabBarIcon = ({
	route,
	iconParams: { size, color, focused },
}: {
	route: RouteProp<ParamListBase, string>;
	iconParams: { size: number; color: string; focused: boolean };
}) => {
	let iconName: VectorIconName;

	if (route.name === "task-creation") {
		iconName = focused ? "create" : "create-outline";
		return <Ionicons name={iconName} size={size} color={color} />;
	} else if (route.name === "all-tasks") {
		iconName = focused ? "list" : "list-outline";
		return <Ionicons name={iconName} size={size} color={color} />;
	} else if (route.name === "recently-deleted") {
		iconName = focused ? "delete-sweep" : "delete-sweep-outline";
		return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
	}
	return null;
};

const TabBarButton = ({ onPress, children }: PropsWithChildren<{ onPress?: Function }>) => {
	const callBack = (event: GestureResponderEvent) => {
		impactAsync();
		onPress?.(event);
	};

	return (
		<View style={styles.tabBarButtonContainer}>
			<TouchableOpacity style={styles.tabBarButton} onPress={callBack}>
				<View style={styles.tabBarButtonContent}>{children}</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	tabBarButtonContainer: {
		alignItems: "center",
	},
	tabBarButton: {
		paddingHorizontal: 16,
	},
	tabBarButtonContent: {
		alignItems: "center",
		justifyContent: "center",
	},
});
