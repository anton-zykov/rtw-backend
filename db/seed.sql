\set ON_ERROR_STOP on
BEGIN;

TRUNCATE TABLE
  "User",
  "Teacher",
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
  ('d6ff850c-5e8c-466d-95d9-03be8d383534', 'Admin', '$2a$10$LzcYoDDAutsZ.mlE5IPh7uzHQS4zHjJojormjB66dpbBABhCaBcR2', 'admin'),
  ('13c88df2-b3de-4de5-a476-31985427a5a6', 'Teacher', '$2a$10$LzcYoDDAutsZ.mlE5IPh7uzHQS4zHjJojormjB66dpbBABhCaBcR2', 'teacher'),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', 'Student', '$2a$10$LzcYoDDAutsZ.mlE5IPh7uzHQS4zHjJojormjB66dpbBABhCaBcR2', 'student'),
  ('2fc7bbd0-1619-42fb-b84a-67fe43c87b41', 'User', '$2a$10$LzcYoDDAutsZ.mlE5IPh7uzHQS4zHjJojormjB66dpbBABhCaBcR2', 'not_set');

INSERT INTO "Admin" (id) VALUES ('d6ff850c-5e8c-466d-95d9-03be8d383534');
INSERT INTO "Teacher" (id) VALUES ('13c88df2-b3de-4de5-a476-31985427a5a6');
INSERT INTO "Student" (id, "teacherId") VALUES ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '13c88df2-b3de-4de5-a476-31985427a5a6');

INSERT INTO "GenitiveTask" (id, nominative, options) VALUES
  ('051b6988-1bec-4697-8e61-f73e34fb4148', 'инженер', '[{"word": "инженеры", "correct": true}, {"word": "инженера", "correct": false}]'),
  ('1cfcea9e-99d8-464f-8437-073ee530052b', 'компьютер', '[{"word": "компьютеры", "correct": true}, {"word": "компьютера", "correct": false}]'),
  ('0faa7203-8742-4bcb-9d32-fb3d88083c44', 'крем', '[{"word": "кремы", "correct": true}, {"word": "крема", "correct": false}]'),
  ('f722f86e-14f8-4ef9-9e50-83de454c1551', 'возраст', '[{"word": "возрасты", "correct": true}, {"word": "возраста", "correct": false}]'),
  ('e24ca05f-7d4e-418b-9049-bb94b62d78e5', 'повар', '[{"word": "повара", "correct": true}, {"word": "повары", "correct": false}]'),
  ('5de3756a-028d-40dc-91eb-74397440e741', 'мастер', '[{"word": "мастера", "correct": true}, {"word": "мастеры", "correct": false}]'),
  ('5ed89502-59d8-44af-a4f8-d36b8754e703', 'оладья', '[{"word": "оладий", "correct": true}, {"word": "оладьев", "correct": false}]'),
  ('66c77285-3c27-46a4-a3f9-65f72ec51096', 'сандалия', '[{"word": "сандалий", "correct": true}, {"word": "сандалиев", "correct": false}]'),
  ('499549f1-8013-4a4b-8557-12a8c4488f62', 'судья', '[{"word": "судей", "correct": true}, {"word": "судьей", "correct": false}]'),
  ('55634785-bed4-4150-89b0-a60879f5e1d4', 'копье', '[{"word": "копий", "correct": true}, {"word": "копьев", "correct": false}]');

INSERT INTO "StudentGenitiveTask" ("studentId", "taskId", "weight") VALUES
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '051b6988-1bec-4697-8e61-f73e34fb4148', 10),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '1cfcea9e-99d8-464f-8437-073ee530052b', 10),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '0faa7203-8742-4bcb-9d32-fb3d88083c44', 5),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', 'f722f86e-14f8-4ef9-9e50-83de454c1551', 5),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', 'e24ca05f-7d4e-418b-9049-bb94b62d78e5', 5),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '5de3756a-028d-40dc-91eb-74397440e741', 5),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '5ed89502-59d8-44af-a4f8-d36b8754e703', 5),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '66c77285-3c27-46a4-a3f9-65f72ec51096', 5),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '499549f1-8013-4a4b-8557-12a8c4488f62', 1),
  ('b53b7776-3a9e-4cfb-9dbc-1a24af5234df', '55634785-bed4-4150-89b0-a60879f5e1d4', 1);

COMMIT;
