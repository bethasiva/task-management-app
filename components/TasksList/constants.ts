import { SortingOrder, TaskStatus, TasksType } from "@/reduxStore/features/task/taskSlice";

export const HEADER_TITLES: Record<TasksType, string> = {
	activeTasks: "All Tasks",
	deletedTasks: "Recently Deleted",
};

export const STATUS_SORT_OPTIONS: {
	status: TaskStatus;
	icon: string;
	title: TaskStatus;
}[] = [
	{ status: "progress", icon: "progress-clock", title: "progress" },
	{ status: "cancelled", icon: "cancel", title: "cancelled" },
	{ status: "completed", icon: "check-circle-outline", title: "completed" },
];

export const DATE_SORT_OPTIONS: {
	order: SortingOrder;
	icon: string;
	title: string;
}[] = [
	{ order: "asc", icon: "sort-calendar-ascending", title: "Earliest" },
	{ order: "desc", icon: "sort-calendar-descending", title: "Latest" },
];
