import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

// Root / — redirect to /dashboard if authed, else /home (landing)
export default async function RootPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/home");
  }
}
