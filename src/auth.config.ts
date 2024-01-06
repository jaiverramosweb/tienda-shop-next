import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs'
import prisma from './lib/prisma';
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },

  callbacks: {
    jwt({ token, user }) {
      if( user ) {
        token.data = user;
      }
        return token;
    },

    session({ session, token, user }) {
      session.user = token.data as any;
        return session;
    },
  },

  providers: [
    Credentials({
        async authorize(credentials) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

            if(!parsedCredentials.success) return null;

            const { email, password } = parsedCredentials.data;

            // Buscar el correo
            const user = await prisma.user.findUnique({ where: { emal: email.toLowerCase() } });

            if(!user) return null;

            // Compara las contraseña
            if( !bcryptjs.compareSync( password, user.password ) ) return null;

            // Regresar el usuario
            const { password: _, ...rest } = user;

            console.log({rest});

            return rest;
        },
      }),

  ]
};

export const { signIn, signOut, auth, handlers } = NextAuth( authConfig );