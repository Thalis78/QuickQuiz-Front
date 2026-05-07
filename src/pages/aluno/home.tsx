import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { Layout } from "@/components/layout";
import { Toast } from "@/components/toast";
import { useNavigate } from "react-router-dom";


const Home: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [toastConfig, setToastConfig] = useState<{
    message: string | null;
    variant: "success" | "error";
  }>({
    message: null,
    variant: "success",
  });

  const showToast = (
    message: string,
    variant: "success" | "error" = "success"
  ) => {
    setToastConfig({ message, variant });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!studentName.trim()) {
      showToast("Por favor, digite seu nome", "error");
      setIsLoading(false);
      return;
    }

    if (!quizCode.trim()) {
      showToast("Por favor, digite o código do quiz", "error");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <Layout>
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((prev) => ({ ...prev, message: null }))}
      />

      <main className="flex flex-col items-center justify-center px-4 pt-32 pb-12">
        <div className="w-full max-w-md bg-gray-50 rounded-2xl p-8 border-4 border-[#4441AA] shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/025b9c6df2eac5de10d3c632cc91f2c43fc130c9?width=284" width="150px" alt="Logo" className="mb-4" />
            <h2 className="text-3xl font-bold text-[#605BEF] text-center mb-2">
              Hora do desafio!🚀
            </h2>
            <p className="text-gray-600 text-center text-sm">
              Digite seu nome e o código do quiz do professor
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#605BEF] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código do Quiz
              </label>
              <input
                type="text"
                placeholder="Ex: QUIZ2024"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                disabled={isLoading}
                maxLength={10}
                className="mb-8 w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#605BEF] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-10 px-4 py-3 bg-gradient-to-r from-[#605BEF] to-[#4441AA] text-white font-bold rounded-lg hover:from-[#4441AA] hover:to-[#3a35a8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
            >
              Começar! <LogIn size={20} />
            </button>

          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-[#605BEF] hover:underline text-sm font-medium"
            >
              ← Voltar para início
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export { Home };
