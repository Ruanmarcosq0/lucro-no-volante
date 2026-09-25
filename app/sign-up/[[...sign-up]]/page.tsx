import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <main className="grid min-h-screen place-items-center bg-[#f3f5f2] px-4 py-10"><div><p className="mb-6 text-center text-2xl font-black text-[#11251f]">Lucro no <span className="text-[#68971f]">Volante</span></p><SignUp signInUrl="/sign-in" forceRedirectUrl="/assinar" /></div></main>;
}
