import { useReduxDispatch, useReduxSelector } from "@/hooks";
import {
	getTaskById,
	permanentDeleteTask,
	restoreDeletedTask,
	TaskStatus,
	TasksType,
	temporaryDeleteTask,
	updateTaskStatus,
} from "@/reduxStore/features/task/taskSlice";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import SnakckBar, { SnackbarRef } from "@/components/SnackBar";
import { formatDateTime } from "@/lib";
import { impactAsync } from "expo-haptics";
import TaskStatusButtons from "@/components/TaskStatusButtons";

export default function Details() {
	// Fetch dynamic route parameters
	const { id, taskType } = useLocalSearchParams<{ id: string; taskType: TasksType }>();

	// Redux hooks
	const dispatch = useReduxDispatch();
	const selectedTask = useReduxSelector((state) => state.tasks.selectedTask);

	// Extract task properties
	const { title, description, status, dateTime, address } = selectedTask;

	// Manage task status locally
	const [currentTaskStatus, setCurrentTaskStatus] = useState<TaskStatus>(status);

	// Handle task status change
	const onTaskStatusChange = (): void => {
		if (id && taskType) {
			impactAsync();
			dispatch(updateTaskStatus({ id, status: currentTaskStatus, taskType }));
			handleShowSnackbar();
		}
	};

	const onTemporaryDeleteTask = () => {
		dispatch(temporaryDeleteTask({ id }));
		goBackWithHaptic();
	};

	const onPermanentDeleteTask = () => {
		dispatch(permanentDeleteTask({ id }));
		goBackWithHaptic();
	};

	const onRestoreDeletedTask = () => {
		dispatch(restoreDeletedTask({ id }));
		goBackWithHaptic();
	};

	const goBackWithHaptic = () => {
		impactAsync();
		router.back();
	};

	const snackbarRef = useRef<SnackbarRef>(null);

	const handleShowSnackbar = () => {
		snackbarRef.current?.onToggleSnackBar();
	};

	useEffect(() => {
		setCurrentTaskStatus(status);
	}, [status]);

	useEffect(() => {
		// dispatch(getTaskById({ id: selectedTaskID, taskType }));
	}, [selectedTask]);

	// Load task details on mount
	useEffect(() => {
		if (id && taskType) {
			dispatch(getTaskById({ id, taskType }));
		}
	}, [id, taskType, dispatch]);

	// Fallback if no task is found
	if (!Object.keys(selectedTask).length) {
		return (
			<Card style={{ justifyContent: "center", alignItems: "center" }}>
				<Card.Content
					style={{
						flex: 1,
						justifyContent: "center",
					}}
				>
					<Text variant="titleLarge">No task found.</Text>
				</Card.Content>
			</Card>
		);
	}

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 50, minHeight: "100%" }}
		>
			<Card style={{ margin: 10, padding: 10 }}>
				<Card.Content>
					<Text variant="titleLarge">{title}</Text>
					<Text variant="bodyMedium" style={{ marginVertical: 10 }}>
						{description}
					</Text>
					<Text variant="bodyMedium" style={{ marginVertical: 10 }}>
						{address}
					</Text>
					<Text variant="bodyMedium">
						Date & Time: {formatDateTime(new Date(dateTime))}
					</Text>
				</Card.Content>
				<Card.Actions style={{ marginTop: 10, flexDirection: "column", gap: 10 }}>
					<TaskStatusButtons
						setCurrentTaskStatus={(value) => setCurrentTaskStatus(value as TaskStatus)}
						currentTaskStatus={currentTaskStatus}
					/>

					<Button
						icon="content-save"
						mode="contained"
						style={{ width: "100%" }}
						onPress={onTaskStatusChange}
					>
						Save Edited Status
					</Button>

					{taskType === "deletedTasks" &&
						[
							{
								icon: "restore",
								label: "Restore The Task",
								callback: onRestoreDeletedTask,
							},
							{
								icon: "delete",
								label: "Delete Permanently",
								callback: onPermanentDeleteTask,
							},
						].map((item) => <CButton key={item.label} item={item} />)}

					{taskType === "activeTasks" &&
						[
							{
								icon: "delete",
								label: "Move to Recently Deleted",
								callback: onTemporaryDeleteTask,
							},
						].map((item) => <CButton key={item.label} item={item} />)}
				</Card.Actions>
			</Card>

			<SnakckBar ref={snackbarRef}>Task status updated successfully.</SnakckBar>
		</ScrollView>
	);
}

const CButton = ({
	item: { label, icon, callback },
}: {
	item: { label: string; icon: string; callback(): void };
}) => {
	return (
		<Button icon={icon} mode="contained" style={{ width: "100%" }} onPress={callback}>
			{label}
		</Button>
	);
};
