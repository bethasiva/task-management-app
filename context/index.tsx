import React, { PropsWithChildren } from "react";
import ReduxProvider from "./ReduxProvider";
import PaperProvider from "./PaperProvider";

export default function RootProvider({ children }: PropsWithChildren) {
	return (
		<ReduxProvider>
			<PaperProvider>{children}</PaperProvider>
		</ReduxProvider>
	);
}
