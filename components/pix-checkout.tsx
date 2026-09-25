"use client";

import { useState } from "react";
import { Check, Copy, LoaderCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PixCheckout({ payload, qrCode, price, pixKey, txid, pending }: { payload: string; qrCode: string; price: number; pixKey: string; txid: string; pending: boolean }) {
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [isPending, setPending] = useState(pending);
  const copy = async () => { await navigator.clipboard.writeText(payload); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  const claim = async () => {
    setClaiming(true);
    try { const response = await fetch("/api/payment-claim", { method: "POST" }); if (!response.ok) throw new Error(); setPending(true); }
    catch { alert("Não foi possível avisar o pagamento. Tente novamente."); }
    finally { setClaiming(false); }
  };
  return <div className="grid overflow-hidden rounded-[30px] bg-white shadow-[0_24px_80px_rgba(17,37,31,.13)] lg:grid-cols-[.9fr_1.1fr]">
    <div className="bg-[#11251f] p-7 text-white sm:p-10"><p className="text-sm font-black uppercase tracking-[.16em] text-[#c8ff39]">Plano Completo</p><p className="mt-4 text-5xl font-black tracking-[-.06em]">R$ {price.toFixed(2).replace('.', ',')}</p><p className="mt-1 font-semibold text-white/55">30 dias de acesso</p><div className="mt-8 space-y-3 text-sm font-bold">{["Dashboard completo","Registros ilimitados","Histórico e metas","Organização do MEI"].map(x=><p key={x} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-[#c8ff39] text-[#11251f]"><Check className="size-4" /></span>{x}</p>)}</div><div className="mt-8 rounded-2xl bg-white/7 p-4 text-sm font-semibold text-white/65"><ShieldCheck className="mb-2 size-5 text-[#c8ff39]" />A liberação é feita após a entrada aparecer no banco. Não pedimos comprovante.</div></div>
    <div className="p-6 sm:p-10"><p className="text-sm font-black uppercase tracking-[.14em] text-[#66801f]">Pague com Pix</p><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Aponte a câmera ou copie o código.</h1><div className="mt-6 grid gap-5 sm:grid-cols-[190px_1fr] sm:items-center"><img src={qrCode} alt="QR Code Pix para assinar" className="mx-auto size-[190px] rounded-2xl border border-[#e0e6e2] p-2" /><div><p className="text-xs font-bold uppercase tracking-wide text-[#7a8882]">Chave Pix</p><p className="mt-1 break-all font-black">{pixKey}</p><p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#7a8882]">Recebedor</p><p className="mt-1 font-black">Marcos Ruan · São Paulo</p><p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#7a8882]">Identificador</p><p className="mt-1 font-mono text-sm font-black">{txid}</p></div></div><Button onClick={copy} variant="outline" className="mt-6 h-13 w-full rounded-2xl border-[#cad4ce] bg-[#f6f8f5] font-black">{copied ? <><Check /> Código copiado</> : <><Copy /> Copiar Pix copia e cola</>}</Button>{isPending ? <div className="mt-6 rounded-2xl border border-[#b9d58a] bg-[#f0f9df] p-5"><p className="font-black text-[#315f19]">Pagamento informado</p><p className="mt-1 text-sm font-semibold text-[#56703d]">Assim que a entrada for conferida no banco, seu painel será liberado.</p><Button onClick={()=>window.location.href="/dashboard"} variant="outline" className="mt-4 w-full rounded-xl bg-white font-black"><RefreshCw /> Verificar meu acesso</Button></div> : <><div className="mt-6 rounded-2xl border border-[#f0d676] bg-[#fff8d8] p-4 text-sm font-semibold text-[#65591f]">Depois de pagar no seu banco, volte aqui e avise o pagamento.</div><Button onClick={claim} disabled={claiming} className="mt-4 h-14 w-full rounded-2xl bg-[#c8ff39] text-base font-black text-[#11251f] hover:bg-[#b9ef31]">{claiming ? <><LoaderCircle className="animate-spin" /> Enviando...</> : "Já paguei — avisar pagamento"}</Button></>}</div>
  </div>;
}
