"use server";

import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const saveAddress = createOrReplaceAddress(address, userId);

    return {
      ok: true,
      saveAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudo guardar la dirección",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storeAddress = await prisma.userAddress.findUnique({
      where: {
        usertId: userId,
      },
    });

    const addressToSave = {
      usertId: userId,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address: address.address,
      address2: address.address2,
      city: address.city,
      postalCode: address.postalCode,
      countryId: address.country,
    };

    if (!storeAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });

      return newAddress;
    }

    const updateAddress = await prisma.userAddress.update({
      where: {
        usertId: userId,
      },
      data: addressToSave,
    });

    return updateAddress;
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo grabar la dirección");
  }
};
