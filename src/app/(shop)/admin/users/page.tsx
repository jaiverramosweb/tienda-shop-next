export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { getAllUsers } from "@/actions";
import { Title } from "@/components";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";
import { UsersTable } from "./ui/UsersTable";

export default async function UsersPage() {
  const { ok, users = [] } = await getAllUsers();

  if (!ok) {
    redirect("/auth");
  }

  return (
    <>
      <Title title=" Mantenimiento de usuarios" />

      <UsersTable users={users} />
    </>
  );
}
