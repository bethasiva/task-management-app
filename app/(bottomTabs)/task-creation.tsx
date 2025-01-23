import TaskForm from "@/components/TaskForm";
import React, { Fragment } from "react";
import { Appbar } from "react-native-paper";

export default function TaskCreation() {
	return (
		<Fragment>
			<Appbar.Header>
				<Appbar.Content title={"Create Task"} />
			</Appbar.Header>
			<TaskForm />
		</Fragment>
	);
}
