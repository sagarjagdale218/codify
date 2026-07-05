export interface StudentProfile {
  name?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  weeklyHours: string;
  goals: string;
  interests: string;
  currentLanguage: string;
  completedModuleIds: string[];
  completedChallengeIds: string[];
  xp: number;
  streakDays: number;
  lastActiveDate: string | null;
  customPaths: Record<string, CustomPath>; // Language key -> path mapping
}

export interface CustomPath {
  language: string;
  level: string;
  summary: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  keyConcepts: string[];
  lesson: Lesson;
}

export interface Lesson {
  lessonTitle: string;
  content: string;
  codeTemplate: string;
  challengeInstructions: string;
  solutionCriteria: string;
  sampleAnswer: string;
}

export interface Challenge {
  id: string;
  title: string;
  language: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  starterCode: string;
  instructions: string;
  solutionCriteria: string;
  xpReward: number;
  sampleSolution: string;
}

export interface MentorMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface ShowcaseComment {
  id: string;
  studentName: string;
  text: string;
  createdAt: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  studentName: string;
  description: string;
  screenshotUrl: string;
  demoLink?: string;
  codeLink?: string;
  tags: string[];
  likes: number;
  likedBy: string[]; // List of names or standard session keys that liked it
  comments: ShowcaseComment[];
  createdAt: string;
}
