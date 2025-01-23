import { combineReducers } from "redux";
import taskReducer from "./features/task/taskSlice";

const rootReducer = combineReducers({
	tasks: taskReducer,
});

export default rootReducer;
