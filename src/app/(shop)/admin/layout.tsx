import { authConfig } from "@/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    
    const session = await getServerSession( authConfig );
    const sessionUserId = session?.user.id;
    if( (!sessionUserId) )
        redirect('/');
    if (!session.user.roles!.includes("admin")) {
        redirect('/');
    }

    return ( <> {children} </> );
}