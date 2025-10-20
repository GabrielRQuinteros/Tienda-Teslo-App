
import { authConfig } from "@/auth.config";
import { Title } from "@/components";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    
    const session = await getServerSession(authConfig);

    if (!session?.user)
        redirect("/auth/login");
    return (
    <div>
        <Title title="Perfil"/>
        <pre>
            { JSON.stringify(session) }
        </pre>
    </div>
  );
}