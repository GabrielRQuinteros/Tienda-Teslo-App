

import { headers } from "next/headers";
export async function getServerCurrentPath () {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const path = headersList.get("x-invoke-path") || ""; // No siempre disponible
    const fullUrl = `${protocol}://${host}${path}`;
    return fullUrl;
}