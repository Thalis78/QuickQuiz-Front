export type User = {
  id: string;
  email: string;
  name: string;
  type: 'professor' | 'student';
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
};


export type QuizQuestion = {
  id: string;
  enunciado: string;
  alternativas: {
    texto: string;
    correta: boolean;
  }[];
  tipo: 'texto' | 'imagem' | 'video' | 'mista';
};

export type QuizConfig = {
  nivel: string;
  categorias: {
    texto: boolean;
    imagem: boolean;
    video: boolean;
    misturado: boolean;
  };
  tempoPorQuestao: number;
  quantidadeQuestoes: number;
  titulo?: string;
};

export type Quiz = {
  id: string;
  config: QuizConfig;
  questoes: QuizQuestion[];
  criadoEm: Date;
};

export type QuizContextType = {
  currentQuiz: Quiz | null;
  savedQuizzes: Quiz[];
  setConfig: (config: QuizConfig) => void;
  addQuestion: (question: QuizQuestion) => void;
  updateQuestion: (id: string, question: QuizQuestion) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  saveQuiz: () => void;
  deleteQuiz: (id: string) => void;
  resetCurrentQuiz: () => void;
  loadQuizzes: () => void;
};

export type Student = {
  id: string;
  name: string;
  joinedAt: Date;
};


export type Room = {
  id: string;
  code: string;
  quiz: Quiz;
  students: Student[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
  startedAt?: Date;
};

export type RoomContextType = {
  currentRoom: Room | null;
  createRoom: (quiz: Quiz) => string;
  addStudent: (studentName: string) => void;
  removeStudent: (studentId: string) => void;
  startQuiz: () => void;
  endQuiz: () => void;
  getRoomByCode: (code: string) => Room | null;
  closeRoom: () => void;
};

export type Professor = {
  id: string;
  name: string;
  email: string;
  type: 'professor';
};

export type QuestionData = {
  enunciado: string;
  alternativas: { texto: string }[];
};

export type Result = {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
};


export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success';
};

export type UserTypeCardProps = {
  type: 'student' | 'teacher';
  title: string;
  iconSrc: string;
  iconAlt: string;
  onClick?: () => void;
};