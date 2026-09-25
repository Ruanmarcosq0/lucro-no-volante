import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { PLAN_PRICE } from "@/lib/commercial";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });
  const user = await currentUser();
  const txid = `LNV${userId.replace(/[^a-zA-Z0-9]/g, "").slice(-20)}`.toUpperCase();
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, { publicMetadata: { ...user?.publicMetadata, paymentStatus: "pending", paymentClaimedAt: new Date().toISOString(), pixTxid: txid, paymentAmount: PLAN_PRICE } });
  return Response.json({ pending: true });
}
