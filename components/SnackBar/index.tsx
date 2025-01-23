import React, { forwardRef, PropsWithChildren, useImperativeHandle, useState } from "react";
import { Snackbar, Text } from "react-native-paper";
import styles from "./styles";

type Props = PropsWithChildren;

export type SnackbarRef = {
	onToggleSnackBar: () => void;
};

const Index = forwardRef<SnackbarRef, Props>(({ children }, ref) => {
	const [showSnackbar, setShowSnackbar] = useState(false);
	const onToggleSnackBar = () => setShowSnackbar((prev) => !prev);

	useImperativeHandle(ref, () => ({
		onToggleSnackBar,
	}));

	return (
		<Snackbar visible={showSnackbar} onDismiss={onToggleSnackBar} duration={4000}>
			<Text style={styles.snackbarText}>{children}</Text>
		</Snackbar>
	);
});

Index.displayName = "SnackbarComponent";

export default Index;
