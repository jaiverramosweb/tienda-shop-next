"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface PorductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsIds: PorductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  // Verificar sesión de usuario
  if (!userId) {
    return {
      ok: false,
      message: "No hay sesión de usuario",
    };
  }

  // Obtener la informacion de los productos
  // Nota: Podemos llevar 2 o + productos con el mimo ID
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsIds.map((p) => p.productId),
      },
    },
  });

  // Calcular los motos // ENcabezado
  const itemsInOrder = productsIds.reduce((count, p) => count + p.quantity, 0);

  // Totales de tax , subTotal y total
  const { subTotal, tax, total } = productsIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;

      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  // Crear la transacción de base de datos

  try {    
      const prismaTx = await prisma.$transaction(async (tx) => {
        // 1 Actualizar el stock de los products
        const updatedProductPromises = products.map(async (product) => {
          // Acumular los valores
          const productQuantity = productsIds
            .filter((p) => p.productId === product.id)
            .reduce((acc, item) => item.quantity + acc, 0);
    
          if (productQuantity === 0) {
            throw new Error(`${product.id} no tiene registros definidos`);
          }
    
          return tx.product.update({
            where: { id: product.id },
            data: {
              // inStock: product.inStock - productQuantity // no hacer
              inStock: {
                decrement: productQuantity,
              },
            },
          });
        });
    
        const updatedProducts = await Promise.all(updatedProductPromises);
    
        // Verificar valores negativos en la existencia == no hay stock
        updatedProducts.forEach((product) => {
          if (product.inStock < 0) {
            throw new Error(`${product.title} no tiene inventario suficiente`);
          }
        });
    
        // 2 Crear la orden - Encabezado - Detalles
        const order = await tx.order.create({
          data: {
            usertId: userId,
            itemsInOrder: itemsInOrder,
            subTotal: subTotal,
            tax: tax,
            total: total,
    
            OrderItem: {
              createMany: {
                data: productsIds.map((p) => ({
                  quantity: p.quantity,
                  size: p.size,
                  productId: p.productId,
                  price:
                    products.find((product) => product.id === p.productId)?.price ??
                    0,
                })),
              },
            },
          },
        });
    
        // 3 Crear la dirección de la orden
        const { country, ...restAddress } = address;
        const orderAddress = await tx.orderAddress.create({
          data: {
            ...restAddress,
            countryId: country,
            orderId: order.id,
          },
        });
    
        return {
          updatedProduct: updatedProducts,
          orden: order,
          orderAddress: orderAddress,
        };
      });

      return {
        ok: true,
        order: prismaTx.orden,
        prismaTx: prismaTx,
      }
  } catch (error:any) {
    return {
        ok: false,
        message: error.message
    }
  }

};
