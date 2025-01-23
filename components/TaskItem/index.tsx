import { Task, TasksType } from "@/reduxStore/features/task/taskSlice";
import { Card, IconButton, MD3Colors, Text, Tooltip } from "react-native-paper";
import { View } from "react-native";
import { router } from "expo-router";
import { impactAsync } from "expo-haptics";
import { DELETE_TOOLTIP_TITLES } from "./constants";
import styles from "./styles";
import { formatDateTime } from "@/lib";

interface TaskItemProps {
	task: Task;
	onDelete(id: string): void;
	taskType: TasksType;
}

export default function TaskItem({
	task: { id, title, dateTime, status },
	onDelete,
	taskType,
}: TaskItemProps) {
	const params: { id: string; taskType: TasksType } = {
		id,
		taskType,
	};

	const handleCardPress = (): void => {
		router.push({
			pathname: "/(taskDetails)/[id]",
			params,
		});
	};

	const onTaskDelete = (): void => {
		impactAsync();
		onDelete(id);
	};

	return (
		<Card style={styles.cardContainer} onPress={handleCardPress}>
			<View style={styles.viewContainer}>
				<View style={styles.textContainer}>
					<Text numberOfLines={1} variant="titleLarge">
						{title}
					</Text>
					<View style={styles.infoContainer}>
						<Text variant="bodyMedium">{formatDateTime(new Date(dateTime))}</Text>
						<Text variant="bodyMedium">{status}</Text>
					</View>
				</View>
				<Tooltip title={DELETE_TOOLTIP_TITLES[taskType] || DELETE_TOOLTIP_TITLES.other}>
					<IconButton
						icon="delete"
						iconColor={MD3Colors.error70}
						mode="contained"
						size={20}
						onPress={onTaskDelete}
					/>
				</Tooltip>
			</View>
		</Card>
	);
}
