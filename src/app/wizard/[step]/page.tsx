import { redirect } from "next/navigation";

export default function StepRedirectPage() {
  redirect("/wizard");
}
