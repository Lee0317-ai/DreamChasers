import { redirect } from "next/navigation";

export default function TimePickToolEntryPage() {
  redirect(process.env.TIMEPICK_APP_URL || "http://localhost:8080/home");
}
