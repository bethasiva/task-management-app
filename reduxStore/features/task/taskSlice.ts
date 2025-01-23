import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

// Define the Task interface
export interface Task {
	id: string;
	title: string;
	description: string;
	dateTime: string;
	address: string;
	status: TaskStatus;
}

export type TaskStatus = "progress" | "completed" | "cancelled";
export type TasksType = "activeTasks" | "deletedTasks";
export type SortingOrder = "asc" | "desc";

interface TaskState {
	activeTasks: Task[];
	deletedTasks: Task[];
	selectedTask: Task;
}

const initialState: TaskState = {
	activeTasks: [],
	deletedTasks: [],
	selectedTask: {} as Task,
};

const loadTasksFromStorage = async (tasksType: TasksType): Promise<Task[]> => {
	try {
		const tasksJson = await AsyncStorage.getItem(tasksType);
		if (tasksJson) {
			return JSON.parse(tasksJson);
		}
	} catch (error) {
		console.error("Error loading tasks from AsyncStorage:", error);
	}
	return [];
};

const saveTasksToStorage = async (tasksType: TasksType, tasks: Task[]) => {
	try {
		await AsyncStorage.setItem(tasksType, JSON.stringify(tasks));
	} catch (error) {
		console.error("Error saving tasks to AsyncStorage:", error);
	}
};

export const loadTasks = createAsyncThunk("task/loadTasks", async (_, { rejectWithValue }) => {
	try {
		const activeTasks = await loadTasksFromStorage("activeTasks");
		const deletedTasks = await loadTasksFromStorage("deletedTasks");
		return { activeTasks, deletedTasks };
	} catch (error) {
		console.error("Error loading tasks:", error);
		return rejectWithValue(error);
	}
});

const { actions, reducer } = createSlice({
	name: "task",
	initialState,
	reducers: {
		createTask(state, action: PayloadAction<Omit<Task, "id">>) {
			const newTask: Task = {
				id: uuid.v4(),
				...action.payload,
			};
			state.activeTasks.push(newTask);
			saveTasksToStorage("activeTasks", state.activeTasks);
		},
		updateTaskStatus(
			state,
			action: PayloadAction<{ id: string; taskType: TasksType; status: TaskStatus }>,
		) {
			const { id, taskType, status } = action.payload;
			state[taskType] = state[taskType].map((task) =>
				task.id === id ? { ...task, status: status } : task,
			);

			saveTasksToStorage("activeTasks", state.activeTasks);
		},
		temporaryDeleteTask(state, action: PayloadAction<{ id: string }>) {
			const { id } = action.payload;
			const task = state.activeTasks.find((task) => task.id === id);
			if (!task) return;
			state.activeTasks = state.activeTasks.filter((task) => task.id !== id);
			state.deletedTasks.push(task);
			saveTasksToStorage("activeTasks", state.activeTasks);
			saveTasksToStorage("deletedTasks", state.deletedTasks);
		},
		permanentDeleteTask(state, action: PayloadAction<{ id: string }>) {
			const { id } = action.payload;
			state.deletedTasks = state.deletedTasks.filter((task) => task.id !== id);
			saveTasksToStorage("deletedTasks", state.deletedTasks);
		},
		restoreDeletedTask(state, action: PayloadAction<{ id: string }>) {
			const { id } = action.payload;
			const taskToRestore = state.deletedTasks.find((task) => task.id === id);
			if (!taskToRestore) return;
			state.deletedTasks = state.deletedTasks.filter((task) => task.id !== id);
			state.activeTasks.push(taskToRestore);
			saveTasksToStorage("activeTasks", state.activeTasks);
			saveTasksToStorage("deletedTasks", state.deletedTasks);
		},
		getTaskById(state, action: PayloadAction<{ id: string; taskType: TasksType }>) {
			const { taskType, id } = action.payload;
			const task = state[taskType].find((task) => task.id === id);
			state.selectedTask = task || ({} as Task);
		},
		sortTasksByStatus(
			state,
			action: PayloadAction<{ taskType: TasksType; statusType: TaskStatus }>,
		) {
			const { taskType, statusType } = action.payload;
			state[taskType].sort((a, b) => {
				if (a.status === statusType && b.status !== statusType) {
					return -1;
				}
				if (a.status !== statusType && b.status === statusType) {
					return 1;
				}
				return 0;
			});
		},
		sortTasksByDate(
			state,
			action: PayloadAction<{
				taskType: TasksType;
				dateAndTimeOrder: SortingOrder;
			}>,
		) {
			const { taskType, dateAndTimeOrder } = action.payload;
			state[taskType].sort((a, b) => {
				const dateA = new Date(a.dateTime).getTime();
				const dateB = new Date(b.dateTime).getTime();
				return dateAndTimeOrder === "asc" ? dateA - dateB : dateB - dateA;
			});
		},
	},
	extraReducers: (builder) => {
		builder.addCase(loadTasks.fulfilled, (state, action) => {
			state.activeTasks = action.payload.activeTasks || [];
			state.deletedTasks = action.payload.deletedTasks || [];
		});
		builder.addCase(loadTasks.rejected, (state, action) => {
			console.error("Failed to load tasks:", action.payload);
		});
	},
});

export const {
	createTask,
	updateTaskStatus,
	temporaryDeleteTask,
	permanentDeleteTask,
	restoreDeletedTask,
	getTaskById,
	sortTasksByStatus,
	sortTasksByDate,
} = actions;

const taskReducer = reducer;
export default taskReducer;
