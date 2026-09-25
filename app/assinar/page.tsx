import QRCode from "qrcode";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PixCheckout } from "@/components/pix-checkout";
import { PIX_CITY, PIX_KEY, PIX_RECEIVER, PLAN_PRICE } from "@/lib/commercial";
import { createPixPayload } from "@/lib/pix";

export default async function SubscribePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const paidUntil = typeof user?.publicMetadata?.paidUntil === "string" ? user.publicMetadata.paidUntil : "";
  if (paidUntil && new Date(paidUntil).getTime() > Date.now()) redirect("/dashboard");
  const txid = `LNV${userId.replace(/[^a-zA-Z0-9]/g, "").slice(-20)}`.toUpperCase();
  const payload = createPixPayload({ key: PIX_KEY, receiver: PIX_RECEIVER, city: PIX_CITY, amount: PLAN_PRICE, txid });
  const qrCode = await QRCode.toDataURL(payload, { width: 420, margin: 1, color: { dark: "#11251F", light: "#FFFFFF" } });
  return <main className="min-h-screen bg-[#f3f5f2] px-4 py-8 text-[#11251f] sm:py-14"><div className="mx-auto max-w-5xl"><p className="mb-7 text-center text-2xl font-black">Lucro no <span className="text-[#68971f]">Volante</span></p><PixCheckout payload={payload} qrCode={qrCode} price={PLAN_PRICE} pixKey={PIX_KEY} txid={txid} pending={user?.publicMetadata?.paymentStatus === "pending"} /></div></main>;
}
