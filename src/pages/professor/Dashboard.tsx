import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { Toast } from "@/components/toast";
import { Layout } from "@/components/layout";

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { loadQuizzes } = useQuiz();

  const [toastConfig, setToastConfig] = useState<{
    message: string | null;
    variant: "success" | "error";
  }>({
    message: null,
    variant: "success",
  });

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const showToast = (
    message: string,
    variant: "success" | "error" = "success",
  ) => {
    setToastConfig({ message, variant });
  };

  const handleLogout = () => {
    showToast("Logout realizado! Até logo!", "success");
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <Layout>
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((prev) => ({ ...prev, message: null }))}
      />

      <main className="px-4 pt-32 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-4 border-[#4441AA]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#605BEF] mb-2">
                  Dashboard do Professor
                </h1>
                <p className="text-[#605BEF] font-bold text-lg">
                  Bem-vindo, Professor(a)!
                </p>
                <p className="text-[#605BEF] font-semibold opacity-80">
                  Gerencie seus quizzes aqui.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border-2 border-[#ee8697] text-[#ee8697] rounded-lg font-semibold hover:bg-[#ee8697] hover:text-white transition duration-200"
              >
                Sair
              </button>
            </div>

            <button
              onClick={() => navigate("/professor/quiz/criar/etapa-1")}
              className="w-full sm:w-auto bg-[#FFC000] text-[#605BEF] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffb800] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Gerar Novo Quiz
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};
