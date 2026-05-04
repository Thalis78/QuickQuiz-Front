import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Toast } from "@/components/toast";
import { Layout } from "@/components/layout";
import { getEmailSuggestions } from "@/utils/apiUtils";

export const ProfessorLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [toastConfig, setToastConfig] = useState<{
    message: string | null;
    variant: "success" | "error";
  }>({
    message: null,
    variant: "success",
  });

  const showToast = (
    message: string,
    variant: "success" | "error" = "success",
  ) => {
    setToastConfig({ message, variant });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const suggestionsList = getEmailSuggestions(value);
    setSuggestions(suggestionsList);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setEmail(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([]);
    setIsLoading(true);

    try {
      if (true) {
        showToast("Bem-vindo ao English Quizz CIEL CURSOS!", "success");
        setTimeout(() => navigate("/professor/dashboard"), 800);
      }
    } catch (error) {
      showToast("Ocorreu um erro ao tentar fazer login.", "error");
    } finally {
      setIsLoading(false);
    }
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
            <img src="/Logo.svg" width="150px" alt="Logo" className="mb-4" />
            <h2 className="text-3xl font-bold text-[#605BEF] text-center mb-2">
              Login do Professor
            </h2>
            <p className="text-gray-600 text-center text-sm">
              Acesse sua conta para gerenciar quizzes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#605BEF] focus:border-transparent outline-none transition"
                placeholder="seu.email@exemplo.com"
                required
                autoComplete="off"
              />

              {suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-4 py-3 text-sm text-gray-700 hover:bg-[#605BEF] hover:text-white cursor-pointer transition-colors border-b last:border-b-0 border-gray-100"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#605BEF] focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#605BEF] text-white py-3 rounded-lg font-semibold hover:bg-[#4f4bd9] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? "Entrando..." : "Entrar"}
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
