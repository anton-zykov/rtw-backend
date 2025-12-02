BEGIN;

TRUNCATE TABLE
  "User",
  "Student",
  "Admin",
  "GenitiveTask",
  "StudentGenitiveTask",
  "StressTask",
  "StudentStressTask",
  "TrickyTask",
  "StudentTrickyTask"
RESTART IDENTITY CASCADE;

INSERT INTO "User" (id, login, "passwordHash") VALUES
  (100, 'SuperAdmin', '$2a$10$kcbWuJ6BMZ8Rigofi6YC0.DXrVJ9sagxxYZKCe5jVbd3M6EHkcwM6');

INSERT INTO "Admin" (id) VALUES (100);

COMMIT;
