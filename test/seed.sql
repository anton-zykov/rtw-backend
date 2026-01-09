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

INSERT INTO "User" (id, login, "passwordHash", "role") VALUES
  ('d6ff850c-5e8c-466d-95d9-03be8d383534', 'SuperAdmin', '$2a$10$kcbWuJ6BMZ8Rigofi6YC0.DXrVJ9sagxxYZKCe5jVbd3M6EHkcwM6', 'admin');

INSERT INTO "Admin" (id) VALUES ('d6ff850c-5e8c-466d-95d9-03be8d383534');

COMMIT;
