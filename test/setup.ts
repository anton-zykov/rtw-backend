// import isPortReachable from 'is-port-reachable';
import fs from 'fs';
import path from 'path';
import dockerCompose from 'docker-compose';
import { execSync } from 'child_process';
import { prismaClient } from 'test/helpers/prismaClient.js';

export async function setup () {
  // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
  // const isDBReachable = await isPortReachable(54310);
  // if (!isDBReachable) {
  // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
  await dockerCompose.upAll({
    cwd: path.join(__dirname),
    log: true,
  });

  await dockerCompose.exec(
    'db',
    ['sh', '-c', 'until pg_isready ; do sleep 1; done'],
    {
      cwd: path.join(__dirname),
    }
  );

  execSync('npx prisma db push');

  const seedPath = path.join(__dirname, 'seed.sql');
  const raw = fs.readFileSync(seedPath, 'utf8');
  const withoutComments = raw
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed !== '' && !trimmed.startsWith('--');
    })
    .join('\n');

  const statements = withoutComments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    await prismaClient.$executeRawUnsafe(stmt);
  }
  // }
}

export async function teardown () {
  // if (isCI) {
  // ️️️✅ Best Practice: Leave the DB up in dev environment
  await dockerCompose.down({
    cwd: path.join(__dirname)
  });
  // } else {
  // ✅ Best Practice: Clean the database occasionally
  // if (Math.ceil(Math.random() * 10) === 10) {
  //  await new OrderRepository().cleanup();
  // }
  // }
}
