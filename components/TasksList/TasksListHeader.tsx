import {
	SortingOrder,
	sortTasksByDate,
	sortTasksByStatus,
	TaskStatus,
	TasksType,
} from "@/reduxStore/features/task/taskSlice";
import { useReduxDispatch, useReduxSelector } from "@/hooks";
import { Appbar, Divider, Menu, Text } from "react-native-paper";
import styles from "./styles";
import { DATE_SORT_OPTIONS, HEADER_TITLES, STATUS_SORT_OPTIONS } from "./constants";
import { capitalizeFirstLetter } from "@/lib";
import { useState } from "react";

export default function TasksListHeader({ taskType }: { taskType: TasksType }) {
	const tasksList = useReduxSelector((state) => state.tasks[taskType]);
	const dispatch = useReduxDispatch();

	const [menuVisible, setMenuVisible] = useState(false);

	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	const onSortTasksByDate = (dateAndTimeOrder: SortingOrder) => {
		setMenuVisible(false);
		dispatch(sortTasksByDate({ taskType, dateAndTimeOrder }));
	};

	const onSortTasksByStatus = (statusType: TaskStatus) => {
		setMenuVisible(false);
		dispatch(sortTasksByStatus({ taskType, statusType }));
	};

	const headerTitle = HEADER_TITLES[taskType] || "";

	return (
		<Appbar.Header>
			<Appbar.Content title={headerTitle} />
			{tasksList.length && (
				<Menu
					visible={menuVisible}
					onDismiss={closeMenu}
					anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
				>
					<Text variant="bodyLarge" style={styles.menuText}>
						Sort by Status
					</Text>

					{STATUS_SORT_OPTIONS.map((option) => (
						<Menu.Item
							key={option.status}
							onPress={() => onSortTasksByStatus(option.status)}
							title={capitalizeFirstLetter(option.title)}
							leadingIcon={option.icon}
						/>
					))}

					<Divider />
					<Text variant="bodyLarge" style={styles.menuText}>
						Sort by Date & Time
					</Text>

					{DATE_SORT_OPTIONS.map((option) => (
						<Menu.Item
							key={option.order}
							onPress={() => onSortTasksByDate(option.order)}
							title={option.title}
							leadingIcon={option.icon}
						/>
					))}
				</Menu>
			)}
		</Appbar.Header>
	);
}
