import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = await auth();

  if (sesion?.user.role !== "admin") {
    redirect("/auth");
  }

  return <>{children}</>;
}
