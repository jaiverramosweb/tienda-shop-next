'use server'

import bcryptjs from 'bcryptjs'
import prisma from "@/lib/prisma";

export const registerUser = async ( name: string, email: string, password: string ) => {
    try {
        
        const user = await prisma.user.create({
            data: {
                name: name,
                emal: email.toLowerCase(),
                password: bcryptjs.hashSync(password),
            },
            select: {
                id: true,
                name: true,
                emal: true,
            }
        });

        return {
            ok: true,
            user: user,
            message: 'Usuario creado',
        }

    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: 'No se pudo crear el usuario'
        }
    }
}