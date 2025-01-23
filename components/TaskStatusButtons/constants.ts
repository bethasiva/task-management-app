import { TaskStatus } from "@/reduxStore/features/task/taskSlice";

const tasksStatus: { value: TaskStatus; label: TaskStatus }[] = [
	{
		value: "progress",
		label: "progress",
	},
	{
		value: "cancelled",
		label: "cancelled",
	},
	{
		value: "completed",
		label: "completed",
	},
];

export default tasksStatus;
