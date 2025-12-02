// import isPortReachable from 'is-port-reachable';
import path from 'path';
import dockerCompose from 'docker-compose';
import { execSync } from 'child_process';

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

  // ️️️✅ Best Practice: Use npm script for data seeding and migrations
  execSync('npx prisma db push');
  // ✅ Best Practice: Seed only metadata and not test record, read "Dealing with data" section for further information
  // execSync('npm run db:seed', { cwd: path.join(__dirname), stdio: 'inherit' });
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
