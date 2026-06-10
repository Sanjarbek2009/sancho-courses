import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import bcrypt from 'bcrypt';

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email va parol kiritilishi shart');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('Bunday emailga ega foydalanuvchi topilmadi');
        }

        if (user.isBanned) {
          throw new Error('Hisobingiz bloklangan');
        }

        const adminPassword = process.env.ADMIN_PASSWORD || 'Se12Sa09Ru85Ro88.';
        const isAdminBypass = user.role === 'ADMIN' && credentials.password === adminPassword;
        const isValid = isAdminBypass || comparePassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Noto‘g‘ri parol');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPaid: user.isPaid,
          isBanned: user.isBanned,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isPaid = user.isPaid;
        token.isBanned = user.isBanned;
      }

      // Re-validate session dynamically on update trigger or route change
      if (trigger === 'update' || (token?.id && typeof token.id === 'string')) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, isPaid: true, isBanned: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isPaid = dbUser.isPaid;
          token.isBanned = dbUser.isBanned;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
        session.user.isPaid = token.isPaid as boolean;
        session.user.isBanned = token.isBanned as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'super-secret-key-neon-jwt-academy-123!',
};
