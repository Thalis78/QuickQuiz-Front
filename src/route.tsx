import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/utils/ProtectedRoute";

import Index from "./pages/Index";
import { ProfessorLogin } from "./pages/professor/Login";
import { ProfessorDashboard } from "./pages/professor/Dashboard";
import { CreateQuizStep1 } from "./pages/professor/CreateQuiz/Step1";
import { QuizRoomPage } from "./pages/professor/QuizRoom";
import { StudentJoinPage } from "./pages/student/JoinRoom";
import { StudentWaitingRoom } from "./pages/student/WaitingRoom";
import { StudentQuizPage } from "./pages/student/QuizPlay";
import { StudentResultsPage } from "./pages/student/Results";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/professor/login" element={<ProfessorLogin />} />
      <Route path="/aluno/entrar" element={<StudentJoinPage />} />
      <Route path="/aluno/entrar/:code" element={<StudentJoinPage />} />
      <Route path="/aluno/sala/:code" element={<StudentWaitingRoom />} />
      <Route path="/aluno/quiz/:code" element={<StudentQuizPage />} />
      <Route path="/aluno/resultados/:code" element={<StudentResultsPage />} />

      <Route
        path="/professor/dashboard"
        element={
          <ProtectedRoute>
            <ProfessorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/quiz/criar/etapa-1"
        element={
          <ProtectedRoute>
            <CreateQuizStep1 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/quiz/sala/:quizId"
        element={
          <ProtectedRoute>
            <QuizRoomPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
