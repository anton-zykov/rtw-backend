\set ON_ERROR_STOP on
BEGIN;

TRUNCATE TABLE
  "User",
  "Teacher",
  "Student",
  "Admin",
  "StudentAdverbsTask",
  "StudentGenitiveTask",
  "StudentStressTask",
  "StudentTrickyTask"
RESTART IDENTITY CASCADE;

INSERT INTO "User" (id, login, "passwordHash", "role") VALUES
  ('d6ff850c-5e8c-466d-95d9-03be8d383534', 'Admin', '$2a$10$LzcYoDDAutsZ.mlE5IPh7uzHQS4zHjJojormjB66dpbBABhCaBcR2', 'admin'),
  ('13c88df2-b3de-4de5-a476-31985427a5a6', 'Teacher', '$2a$10$LzcYoDDAutsZ.mlE5IPh7uzHQS4zHjJojormjB66dpbBABhCaBcR2', 'teacher'),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', 'Student', '$2a$10$LzcYoDDAutsZ.mlE5IPh7uzHQS4zHjJojormjB66dpbBABhCaBcR2', 'student'),
  ('2fc7bbd0-1619-42fb-b84a-67fe43c87b41', 'User', '$2a$10$LzcYoDDAutsZ.mlE5IPh7uzHQS4zHjJojormjB66dpbBABhCaBcR2', 'not_set');

INSERT INTO "Admin" (id) VALUES ('d6ff850c-5e8c-466d-95d9-03be8d383534');
INSERT INTO "Teacher" (id) VALUES ('13c88df2-b3de-4de5-a476-31985427a5a6');
INSERT INTO "Student" (id, "teacherId", "age") VALUES ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '13c88df2-b3de-4de5-a476-31985427a5a6', 0);

-- INSERT INTO "StudentAdverbsTask" ("studentId", "taskId", "weight") VALUES
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '12c2dfd7-f8d5-4a98-8fbd-5e4007ede2d6', 10),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '6aa9f0e0-eaaf-4c9d-8f2c-d36f6ceb975d', 10),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '95b91b21-64f8-4b76-86d7-59daae4689e9', 5),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '1e22dedb-7f4b-4e2c-a000-fe410b0db846', 5),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '80e59c12-f669-4696-abf9-78b64b160c7b', 5),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '23d4dbba-f75b-4fbb-94d2-9af3dfa361f9', 5),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', 'ac91bbe4-b39e-45d7-b01f-d8c6d9898073', 5),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', 'a3a136f1-20d6-43a6-9d55-e39018f77e6d', 5),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '1f3788b7-3eb2-4994-8715-026942c10200', 1),
--   ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '280af36c-3a66-483e-a36f-21aa695c1750', 1);

COMMIT;
