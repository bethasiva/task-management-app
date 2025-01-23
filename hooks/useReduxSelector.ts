import { useSelector } from "react-redux";
import { ReduxState } from "@/reduxStore";

const useReduxSelector = <TSelected>(selector: (state: ReduxState) => TSelected) =>
	useSelector<ReduxState, TSelected>(selector);
export default useReduxSelector;
