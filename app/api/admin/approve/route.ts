import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { OWNER_EMAIL, PLAN_DAYS } from "@/lib/commercial";

export async function POST(request: Request) {
  const { userId: adminId } = await auth();
  if (!adminId) return Response.json({ error: "unauthorized" }, { status: 401 });
  const admin = await currentUser();
  if (admin?.primaryEmailAddress?.emailAddress.toLowerCase() !== OWNER_EMAIL) return Response.json({ error: "forbidden" }, { status: 403 });
  const { userId } = await request.json() as { userId?: string };
  if (!userId) return Response.json({ error: "missing_user" }, { status: 400 });
  const client = await clerkClient();
  const customer = await client.users.getUser(userId);
  const existing = typeof customer.publicMetadata?.paidUntil === "string" ? new Date(customer.publicMetadata.paidUntil).getTime() : 0;
  const start = Math.max(Date.now(), Number.isFinite(existing) ? existing : 0);
  const paidUntil = new Date(start + PLAN_DAYS * 86400000).toISOString();
  await client.users.updateUserMetadata(userId, { publicMetadata: { ...customer.publicMetadata, plan: "completo", paidUntil, paymentStatus: "approved", approvedAt: new Date().toISOString() } });
  return Response.json({ approved: true, paidUntil });
}
