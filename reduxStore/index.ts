import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
	reducer: rootReducer,
	// devTools: Boolean(process.env.ENABLE_REDUX_DEV_TOOLS),
});

export type ReduxState = ReturnType<typeof store.getState>;
export type ReduxDispatch = typeof store.dispatch;

export default store;
