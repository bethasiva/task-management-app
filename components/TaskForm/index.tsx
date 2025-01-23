import React, { useRef, useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { TextInput, HelperText, Button, Text } from "react-native-paper";
import { Formik, FormikErrors, FormikHelpers, FormikTouched } from "formik";
import * as Yup from "yup";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { createTask, TaskStatus } from "@/reduxStore/features/task/taskSlice";
import { formatDateTime } from "@/lib";
import { ScrollView } from "react-native";
import TaskStatusButtons from "@/components/TaskStatusButtons";
import { useReduxDispatch } from "@/hooks";
import SnakckBar, { SnackbarRef } from "@/components/SnackBar";
import { impactAsync } from "expo-haptics";
import styles from "./styles";

// Define the initial values and validation schema for TypeScript
interface FormValues {
	title: string;
	description: string;
	address: string;
	dateTime: Date;
	status: TaskStatus;
}

// Yup validation schema
const validationSchema = Yup.object({
	title: Yup.string().trim().required("Title is required"),
	description: Yup.string().trim().required("Description is required"),
	address: Yup.string().trim().required("Address is required"),
	dateTime: Yup.date().required("Date and Time is required"),
	status: Yup.string().required("Status is required"),
});

// Form initialvalues
const initialValues: FormValues = {
	title: "",
	description: "",
	address: "",
	dateTime: new Date(),
	status: "progress",
};

export default function TaskForm() {
	const [showDateTimePicker, setShowDateTimePicker] = useState(false);
	const snackbarRef = useRef<SnackbarRef>(null);
	const dispatch = useReduxDispatch();

	const handleShowSnackbar = () => {
		snackbarRef.current?.onToggleSnackBar();
	};

	const openDateTimePicker = () => {
		setShowDateTimePicker(true);
		impactAsync();
	};

	const handleSave = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
		impactAsync();
		const newTask = {
			...values,
			dateTime: values.dateTime.toISOString(),
		};

		dispatch(createTask(newTask));
		handleShowSnackbar();
		resetForm(initialValues);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSave}
					>
						{({ handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
							return (
								<View style={styles.formContainer}>
									{/* Title Field */}
									<TextInput
										label="Title"
										mode="outlined"
										value={values.title}
										onChangeText={(value) => setFieldValue("title", value)}
										onBlur={handleBlur("title")}
										error={hasError(touched, errors, "title")}
										onSubmitEditing={Keyboard.dismiss}
									/>
									{renderHelperText("title", errors, touched)}

									{/* Description Field */}
									<TextInput
										label="Description"
										mode="outlined"
										multiline={true}
										value={values.description}
										onChangeText={(value) =>
											setFieldValue("description", value)
										}
										onBlur={handleBlur("description")}
										error={hasError(touched, errors, "description")}
										scrollEnabled={false}
									/>
									{renderHelperText("description", errors, touched)}

									{/* Date & Time Picker */}
									<DateTimePickerModal
										isVisible={showDateTimePicker}
										mode="datetime"
										date={values.dateTime}
										onConfirm={(date) => {
											setShowDateTimePicker(false);
											setFieldValue("dateTime", date);
										}}
										onCancel={() => setShowDateTimePicker(false)}
									/>

									<TextInput
										label="Address"
										mode="outlined"
										multiline={true}
										value={values.address}
										onChangeText={(value) => setFieldValue("address", value)}
										onBlur={handleBlur("address")}
										error={hasError(touched, errors, "address")}
										scrollEnabled={false}
									/>
									{renderHelperText("address", errors, touched)}

									<Text style={styles.dateTimePicker}>
										{`Selected Date & Time: ${formatDateTime(values.dateTime)}`}
									</Text>

									<Button
										mode="outlined"
										onPress={openDateTimePicker}
										style={styles.dateTimePickerButton}
									>
										Select Date & Time
									</Button>

									<TaskStatusButtons
										setCurrentTaskStatus={(value) =>
											setFieldValue("status", value)
										}
										currentTaskStatus={values.status}
									/>

									{/* Submit Button */}
									<Button
										mode="contained"
										style={styles.submitButton}
										onPress={() => handleSubmit()}
									>
										Create task
									</Button>
								</View>
							);
						}}
					</Formik>
				</TouchableWithoutFeedback>
			</ScrollView>
			<SnakckBar ref={snackbarRef}>Task created successfully.</SnakckBar>
		</KeyboardAvoidingView>
	);
}

const renderHelperText = (
	field: keyof FormValues,
	errors: FormikErrors<FormValues>,
	touched: FormikTouched<FormValues>,
) => (
	<HelperText type="error" visible={hasError(touched, errors, field)}>
		{errors[field] as string}
	</HelperText>
);

const hasError = (
	touched: FormikTouched<FormValues>,
	errors: FormikErrors<FormValues>,
	field: keyof FormValues,
): boolean => {
	return Boolean(touched[field] && errors[field]);
};
