import { redirect } from "next/navigation";

/** /pricing previously 404'd — send people to the marketing pricing section. */
export default function PricingRedirect() {
  redirect("/home#pricing");
}
