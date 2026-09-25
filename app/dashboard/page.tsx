import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "../dashboard";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const paidUntil = typeof user?.publicMetadata?.paidUntil === "string" ? user.publicMetadata.paidUntil : "";
  if (!paidUntil || new Date(paidUntil).getTime() < Date.now()) redirect("/assinar");
  return <Dashboard />;
}
