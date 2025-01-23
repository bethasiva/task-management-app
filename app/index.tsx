import { Redirect } from "expo-router";
import { useReduxDispatch } from "@/hooks";
import { loadTasks } from "@/reduxStore/features/task/taskSlice";
import { useEffect } from "react";

export default function Index() {
	const dispatch = useReduxDispatch();
	useEffect(() => {
		dispatch(loadTasks());
	}, [dispatch]);

	return <Redirect href={"/(bottomTabs)/task-creation"} />;
}
