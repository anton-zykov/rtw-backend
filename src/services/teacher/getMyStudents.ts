import type { PrismaClient, Student, User } from '@prisma/client';

export async function getMyStudents (
  prisma: PrismaClient,
  input: {
    teacherId: string;
  }
): Promise<(
  Pick<Student, 'id' | 'age' | 'taskTypes'> &
  Pick<User, 'id' | 'login' | 'active' | 'fullName' | 'email' | 'telegramId'>
)[]> {
  const students = await prisma.student.findMany({
    where: {
      teacherId: input.teacherId,
    },
    include: {
      user: {
        select: {
          id: true,
          active: true,
          login: true,
          fullName: true,
          email: true,
          telegramId: true,
        }
      }
    }
  });

  return students.map((student) => ({
    id: student.id,
    login: student.user.login,
    age: student.age,
    active: student.user.active,
    fullName: student.user.fullName,
    email: student.user.email,
    telegramId: student.user.telegramId,
    taskTypes: student.taskTypes,
  }));
}
