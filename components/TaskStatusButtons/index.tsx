import React, { useCallback } from "react";
import { SegmentedButtons } from "react-native-paper";
import { TaskStatus } from "@/reduxStore/features/task/taskSlice";
import { impactAsync } from "expo-haptics";
import tasksStatus from "./constants";

type TaskStatusButtonsProps = {
	currentTaskStatus: TaskStatus;
	setCurrentTaskStatus: (value: TaskStatus) => void;
};

export default function TaskStatusButtons({
	currentTaskStatus,
	setCurrentTaskStatus,
}: TaskStatusButtonsProps) {
	const onValueChange = useCallback(
		(value: TaskStatus) => {
			impactAsync();
			setCurrentTaskStatus(value);
		},
		[setCurrentTaskStatus],
	);

	return (
		<SegmentedButtons
			value={currentTaskStatus}
			onValueChange={(value) => onValueChange(value as TaskStatus)}
			buttons={tasksStatus}
		/>
	);
}
