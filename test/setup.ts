import isInCi from 'is-in-ci';
import fs from 'fs';
import path from 'path';
import dockerCompose from 'docker-compose';
import { execSync } from 'child_process';
import { prismaClient } from 'test/helpers/prismaClient.js';

export async function setup () {
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
}

export async function teardown () {
  if (isInCi) {
    await dockerCompose.down({
      cwd: path.join(__dirname)
    });
  }
}
