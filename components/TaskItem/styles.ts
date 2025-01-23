import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	cardContainer: {
		marginBottom: 10,
		borderRadius: 0,
		shadowOpacity: 0,
	},
	viewContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
	},
	textContainer: {
		flex: 1,
		marginRight: 8,
	},
	infoContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});

export default styles;
