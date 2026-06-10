import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && session.user && session.user.role === 'ADMIN';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const lessonId = params.id;
    const { title, videoUrl, description, notes, orderIndex, moduleTitle } = await req.json();

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    let moduleId = lesson.moduleId;

    if (moduleTitle) {
      let courseModule = await prisma.module.findFirst({
        where: { title: moduleTitle },
      });

      if (!courseModule) {
        const moduleCount = await prisma.module.count();
        courseModule = await prisma.module.create({
          data: {
            title: moduleTitle,
            orderIndex: moduleCount + 1,
          },
        });
      }
      moduleId = courseModule.id;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: title !== undefined ? title : lesson.title,
        videoUrl: videoUrl !== undefined ? videoUrl : lesson.videoUrl,
        description: description !== undefined ? description : lesson.description,
        notes: notes !== undefined ? notes : lesson.notes,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : lesson.orderIndex,
        moduleId,
      },
    });

    return NextResponse.json({ message: 'Lesson updated successfully', lesson: updatedLesson });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && session.user && session.user.role === 'ADMIN';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const lessonId = params.id;

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
