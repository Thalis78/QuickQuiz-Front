import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/utils/ProtectedRoute";

import Index from "./pages/Index";
import { CreateQuizStep1 } from "./pages/professor/gerarQuiz";
import { AboutSection } from "./pages/sobre/sobreCiel";
import { Home } from "./pages/aluno/home";
import { ProfessorDashboard } from "./pages/professor/Dashboard";
import { ProfessorLogin } from "./pages/professor/Login";
import Desenvolvedores from "./pages/dev/Desenvolvedores";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/professor/login" element={<ProfessorLogin />} />
      <Route path="/sobre/ciel" element={<AboutSection />} />
      <Route path="/aluno/home" element={<Home />} />
      <Route path="/desenvolvedores" element={<Desenvolvedores />} />

      <Route
        path="/professor/dashboard"
        element={
          <ProtectedRoute>
            <ProfessorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/quiz/gerar-quiz"
        element={
          <ProtectedRoute>
            <CreateQuizStep1 />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
