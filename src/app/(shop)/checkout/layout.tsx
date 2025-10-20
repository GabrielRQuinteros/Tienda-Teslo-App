import { authConfig } from "@/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function CheckoutLayout ({ children }: { children: React.ReactNode;}) {

    const session = await getServerSession(authConfig);

    if (!session?.user)
        redirect(redirect(`/auth/login?redirectTo=${encodeURIComponent('/checkout/address')}`));

    return (
        <>
            {children}
        </>
  )
}
