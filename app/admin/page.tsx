import { AdminLogin } from "@/components/AdminLogin";
import { AdminPanel } from "@/components/AdminPanel";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminFromCookies();

  if (!session) return <AdminLogin />;

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId }, select: { permissions: true, isActive: true } });
  if (!user?.isActive) return <AdminLogin />;

  let permissions: Record<string, boolean> = {};
  try { permissions = JSON.parse(user.permissions) as Record<string, boolean>; } catch { permissions = {}; }

  return <AdminPanel role={session.role} username={session.username} userId={session.userId} permissions={permissions} />;
}
