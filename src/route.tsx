import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/utils/ProtectedRoute";

import Index from "./pages/Index";
import { ProfessorLogin } from "./pages/professor/login";
import { ProfessorDashboard } from "./pages/professor/dashboard";
import { CreateQuizStep1 } from "./pages/professor/gerarQuiz";
import { AboutSection } from "./pages/sobre/sobreCiel";
import { Home } from "./pages/aluno";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/professor/login" element={<ProfessorLogin />} />
      <Route path="/sobre/ciel" element={<AboutSection />} />
      <Route path="/aluno/home" element={<Home />} />

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
    </Routes>
  );
};
