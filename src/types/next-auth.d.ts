import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'ADMIN';
      isPaid: boolean;
      isBanned: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'USER' | 'ADMIN';
    isPaid: boolean;
    isBanned: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'USER' | 'ADMIN';
    isPaid: boolean;
    isBanned: boolean;
  }
}
