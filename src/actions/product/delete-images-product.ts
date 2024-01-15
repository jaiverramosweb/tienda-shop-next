"use server";

import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteImagesProduct = async (id: number, url: string) => {
  if (!url) {
    return {
      ok: false,
      error: "No se pueden borrar imagenes de FS",
    };
  }

  const imageName = url.split("/").pop()?.split(".")[0] ?? "";

  try {
    await cloudinary.uploader.destroy(imageName);

    const deleteImage = await prisma.productImage.delete({
      where: { id },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    // Revalidar los paths
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${deleteImage.product.slug}`);
    revalidatePath(`/product/${deleteImage.product.slug}`);
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pido eliminar la imagen",
    };
  }
};
