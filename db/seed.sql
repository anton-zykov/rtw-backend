\set ON_ERROR_STOP on
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

INSERT INTO "User" (id, login) VALUES
  (1, 'Alice'),
  (2, 'Bob');

INSERT INTO "Admin" (id) VALUES (1);

INSERT INTO "Student" (id) VALUES (2);

INSERT INTO "GenitiveTask" (id, nominative, options) VALUES
  ('a', 'инженер', '[{"word": "инженеры", "correct": true}, {"word": "инженера", "correct": false}]'),
  ('b', 'компьютер', '[{"word": "компьютеры", "correct": true}, {"word": "компьютера", "correct": false}]'),
  ('c', 'крем', '[{"word": "кремы", "correct": true}, {"word": "крема", "correct": false}]'),
  ('d', 'возраст', '[{"word": "возрасты", "correct": true}, {"word": "возраста", "correct": false}]'),
  ('e', 'повар', '[{"word": "повара", "correct": true}, {"word": "повары", "correct": false}]'),
  ('f', 'мастер', '[{"word": "мастера", "correct": true}, {"word": "мастеры", "correct": false}]'),
  ('g', 'оладья', '[{"word": "оладий", "correct": true}, {"word": "оладьев", "correct": false}]'),
  ('h', 'сандалия', '[{"word": "сандалий", "correct": true}, {"word": "сандалиев", "correct": false}]'),
  ('i', 'судья', '[{"word": "судей", "correct": true}, {"word": "судьей", "correct": false}]'),
  ('j', 'копье', '[{"word": "копий", "correct": true}, {"word": "копьев", "correct": false}]');

INSERT INTO "StudentGenitiveTask" ("studentId", "taskId") VALUES
  (2, 'a'),
  (2, 'b'),
  (2, 'c'),
  (2, 'd'),
  (2, 'e'),
  (2, 'f'),
  (2, 'g'),
  (2, 'h'),
  (2, 'i'),
  (2, 'j');

COMMIT;
