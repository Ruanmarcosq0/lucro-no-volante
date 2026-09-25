import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminApprovals } from "@/components/admin-approvals";
import { OWNER_EMAIL } from "@/lib/commercial";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const owner = await currentUser();
  if (owner?.primaryEmailAddress?.emailAddress.toLowerCase() !== OWNER_EMAIL) redirect("/dashboard");
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100, orderBy: "-created_at" });
  const claims = users.data.filter(user => user.publicMetadata?.paymentStatus === "pending").map(user => ({
    id: user.id,
    name: user.fullName || user.firstName || "Assinante",
    email: user.primaryEmailAddress?.emailAddress || "Sem e-mail",
    txid: typeof user.publicMetadata?.pixTxid === "string" ? user.publicMetadata.pixTxid : "SEM ID",
    amount: typeof user.publicMetadata?.paymentAmount === "number" ? user.publicMetadata.paymentAmount : 19.9,
    claimedAt: typeof user.publicMetadata?.paymentClaimedAt === "string" ? user.publicMetadata.paymentClaimedAt : user.createdAt.toString(),
  }));
  return <main className="min-h-screen bg-[#f3f5f2] px-4 py-10 text-[#11251f]"><div className="mx-auto max-w-4xl"><p className="text-sm font-black uppercase tracking-[.16em] text-[#66801f]">Área do proprietário</p><h1 className="mt-2 text-4xl font-black tracking-[-.05em]">Liberar assinantes</h1><p className="mb-8 mt-3 font-semibold text-[#718079]">Confira o valor e o identificador no extrato Pix antes de liberar.</p><AdminApprovals initialClaims={claims} /></div></main>;
}
