import { AdminLogin } from "@/components/AdminLogin";
import { AdminPanel } from "@/components/AdminPanel";
import { isAdminFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminFromCookies();

  return authenticated ? <AdminPanel /> : <AdminLogin />;
}
