import { View } from "react-native";
import {
	permanentDeleteTask,
	TasksType,
	temporaryDeleteTask,
} from "@/reduxStore/features/task/taskSlice";
import { useReduxDispatch, useReduxSelector } from "@/hooks";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Text } from "react-native-paper";
import TaskItem from "@/components/TaskItem";
import styles from "./styles";
import { Fragment } from "react";
import TasksListHeader from "./TasksListHeader";

export default function TasksList({ taskType }: { taskType: TasksType }) {
	const tasksList = useReduxSelector((state) => state.tasks[taskType]);
	const dispatch = useReduxDispatch();
	const onTaskDelete = (id: string) => {
		switch (taskType) {
			case "activeTasks":
				dispatch(temporaryDeleteTask({ id }));
				break;
			case "deletedTasks":
				dispatch(permanentDeleteTask({ id }));
		}
	};

	return (
		<Fragment>
			<TasksListHeader taskType={taskType} />
			<Animated.FlatList
				showsVerticalScrollIndicator={false}
				data={tasksList}
				itemLayoutAnimation={LinearTransition}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={() => (
					<View style={styles.container}>
						<Text variant="bodyLarge">No tasks found</Text>
					</View>
				)}
				renderItem={({ item }) => (
					<TaskItem task={item} onDelete={onTaskDelete} taskType={taskType} />
				)}
			/>
		</Fragment>
	);
}
