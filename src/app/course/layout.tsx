import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect('/login?redirect=/course');
  }

  // Fetch fresh DB record to bypass stale client cookies
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPaid: true, role: true, isBanned: true },
  });

  if (!dbUser || dbUser.isBanned) {
    redirect('/login?error=banned');
  }

  const hasAccess = dbUser.isPaid || dbUser.role === 'ADMIN';

  if (!hasAccess) {
    redirect('/#pricing');
  }

  return <>{children}</>;
}
