'use server';

import prisma from "@/lib/prisma";

export const setTransactionId = async( orderId: string, transactionId: string ) => {
    try {
        
        const order = await prisma.order.update({
            where: {id: orderId},
            data: { transationId: transactionId }
        });

        if( !order ) {
            return {
                ok: false,
                message: `No se encontro la orden con el ID ${ orderId }`,
            }
        }

        return {
            ok: true,
            message: 'Id de la transaccion actualizado',
        }

    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo actualizar el id de la transaccion',
        }
    }
}