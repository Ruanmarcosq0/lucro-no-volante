"use client";

import { useState } from "react";
import { Check, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Claim = { id: string; name: string; email: string; txid: string; amount: number; claimedAt: string };

export function AdminApprovals({ initialClaims }: { initialClaims: Claim[] }) {
  const [claims, setClaims] = useState(initialClaims);
  const [loading, setLoading] = useState<string | null>(null);
  const approve = async (userId: string) => {
    setLoading(userId);
    try { const response = await fetch("/api/admin/approve", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId }) }); if (!response.ok) throw new Error(); setClaims(items => items.filter(item => item.id !== userId)); }
    catch { alert("Não foi possível liberar este acesso."); }
    finally { setLoading(null); }
  };
  return <div className="space-y-4">{claims.length === 0 ? <div className="rounded-[26px] bg-white p-10 text-center shadow-sm"><Check className="mx-auto size-9 text-[#63901d]" /><h2 className="mt-4 text-xl font-black">Nenhum pagamento aguardando</h2><p className="mt-2 font-semibold text-[#718079]">Atualize a página quando receber um novo Pix.</p><Button onClick={()=>location.reload()} variant="outline" className="mt-5 rounded-xl"><RefreshCw /> Atualizar</Button></div> : claims.map(claim=><article key={claim.id} className="grid gap-4 rounded-[24px] bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-lg font-black">{claim.name}</p><p className="text-sm font-semibold text-[#718079]">{claim.email}</p><div className="mt-3 flex flex-wrap gap-2 text-xs font-black"><span className="rounded-full bg-[#eef2ef] px-3 py-1.5">R$ {claim.amount.toFixed(2).replace('.', ',')}</span><span className="rounded-full bg-[#fff3bd] px-3 py-1.5">{claim.txid}</span><span className="rounded-full bg-[#eef2ef] px-3 py-1.5">{new Date(claim.claimedAt).toLocaleString("pt-BR")}</span></div></div><Button onClick={()=>approve(claim.id)} disabled={loading===claim.id} className="h-12 rounded-2xl bg-[#c8ff39] px-6 font-black text-[#11251f]">{loading===claim.id ? <LoaderCircle className="animate-spin" /> : <Check />} Liberar 30 dias</Button></article>)}</div>;
}
