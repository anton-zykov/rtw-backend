// import { vi } from 'vitest';
import type { FastifyInstance } from 'fastify';

// vi.mock('#/services/user/index.js', () => ({
//   findUserByLogin: vi.fn(({ login }) => ({
//     id: 1,
//     login,
//     passwordHash: '$2a$10$kcbWuJ6BMZ8Rigofi6YC0.DXrVJ9sagxxYZKCe5jVbd3M6EHkcwM6' // hash for 'test-password'
//   })),
// }));

// vi.mock('#/services/admin/index.js', () => ({
//   findAdminById: vi.fn((_prisma, { id }) => (
//     id === 1
//       ? {
//           id: 1,
//           login: 'Alice',
//           passwordHash: '$2a$10$kcbWuJ6BMZ8Rigofi6YC0.DXrVJ9sagxxYZKCe5jVbd3M6EHkcwM6'
//         }
//       : null
//   )),
// }));

// vi.mock('#/services/student/index.js', () => ({
//   findStudentById: vi.fn((_prisma, { id }) => (
//     id === 2
//       ? {
//           id: 2,
//           login: 'Bob',
//           passwordHash: '$2a$10$kcbWuJ6BMZ8Rigofi6YC0.DXrVJ9sagxxYZKCe5jVbd3M6EHkcwM6'
//         }
//       : null
//   )),
// }));

export async function loginAndGetCookie (app: FastifyInstance) {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      login: 'SuperAdmin',
      password: 'test-password',
    },
  });

  if (res.statusCode !== 200) {
    throw new Error(`Login failed in test: ${res.statusCode} ${res.body}`);
  }

  const cookie = res.cookies.find(cookie => cookie.name === 'sid');

  if (!cookie) {
    throw new Error('Session cookie was not set');
  }

  return `sid=${cookie.value}`;
}
