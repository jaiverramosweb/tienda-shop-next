'use server'

import prisma from "@/lib/prisma"

export const deleteUserAddress = async( userId: string ) => {
    try {

        await prisma.userAddress.delete({
            where: {
                usertId: userId
            }
        });

        return {
            ok: true,
            message: 'Dirección eliminada'
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo eliminar la dirección'
        }
    }
}