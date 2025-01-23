export default function formatDateTime(date: Date): string {
	if (!date) return "";

	const options: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	};

	return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}
