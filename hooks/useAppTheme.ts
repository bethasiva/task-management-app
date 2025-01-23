import { useState } from "react";
import { useColorScheme } from "react-native";

const useAppTheme = () => {
	const colorScheme = useColorScheme(); // 'light' or 'dark'
	const [localColorscheme, setLocalColorscheme] = useState(colorScheme);
	const toggleTheme = () => {
		const newScheme = localColorscheme === "light" ? "dark" : "light";
		setLocalColorscheme(newScheme);
	};

	return { toggleTheme, colorScheme: localColorscheme };
};

export default useAppTheme;
