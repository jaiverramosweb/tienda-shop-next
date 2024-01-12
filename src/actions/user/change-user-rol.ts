"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserrol = async (id: string, role: string) => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "Debe de ser un usuario administrador",
    };
  }

  try {
    const nreRole = role === "admin" ? "admin" : "user";

    const user = await prisma.user.update({
      where: { id },
      data: { role: nreRole },
    });

    revalidatePath("/admin/users");

    return {
      ok: true,
      message: "Rol actualizado",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudo actualizar del usuario",
    };
  }
};
