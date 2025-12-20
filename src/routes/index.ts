import { adminRoutes } from './admin/index.js';
import { authRoutes } from './auth/index.js';
import {
  genitiveTaskPoolRoutes,
  genitiveTaskStudentRoutes,
  genitiveTaskExerciseRoutes
} from './genitive-task/index.js';
import { healthRoutes } from './health.js';
import {
  stressTaskPoolRoutes,
  stressTaskStudentRoutes,
  stressTaskExerciseRoutes
} from './stress-task/index.js';
import { studentRoutes } from './student/index.js';
import { teacherRoutes } from './teacher/index.js';
import {
  trickyTaskPoolRoutes,
  trickyTaskStudentRoutes,
  trickyTaskExerciseRoutes
} from './tricky-task/index.js';
import { userRoutes } from './user/index.js';

export {
  adminRoutes,
  authRoutes,
  genitiveTaskExerciseRoutes,
  genitiveTaskPoolRoutes,
  genitiveTaskStudentRoutes,
  healthRoutes,
  stressTaskExerciseRoutes,
  stressTaskPoolRoutes,
  stressTaskStudentRoutes,
  studentRoutes,
  teacherRoutes,
  trickyTaskExerciseRoutes,
  trickyTaskPoolRoutes,
  trickyTaskStudentRoutes,
  userRoutes
};
