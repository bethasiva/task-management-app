import { useDispatch } from "react-redux";
import { ReduxDispatch } from "@/reduxStore";

const useReduxDispatch = () => useDispatch<ReduxDispatch>();
export default useReduxDispatch;
