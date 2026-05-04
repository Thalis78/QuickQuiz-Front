import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { QuizConfig, QuizQuestion, Quiz, QuizContextType } from "@/types/type";
import { Toast } from "@/components/toast";

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:3001/api";
const PROFESSOR_EMAIL = "professor@ciel.com";

export const QuizProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>({
    id: crypto.randomUUID(),
    config: {
      nivel: "Fácil",
      categorias: {
        texto: false,
        imagem: false,
        video: false,
        misturado: true,
      },
      tempoPorQuestao: 30,
      quantidadeQuestoes: 5,
    },
    questoes: [],
    criadoEm: new Date(),
  });

  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado do Toast para o Provider
  const [toastConfig, setToastConfig] = useState<{
    message: string | null;
    variant: "success" | "error";
  }>({
    message: null,
    variant: "success",
  });

  const showToast = useCallback(
    (message: string, variant: "success" | "error" = "success") => {
      setToastConfig({ message, variant });
    },
    [],
  );

  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/quizzes/${PROFESSOR_EMAIL}`);
      if (!response.ok) throw new Error("Erro ao carregar quizzes");
      const data = await response.json();

      const quizzes: Quiz[] = data.map((item: any) => ({
        id: item.id,
        config: item.config,
        questoes: item.questions,
        criadoEm: new Date(item.created_at),
      }));
      setSavedQuizzes(quizzes);
    } catch (error) {
      console.error("❌ Erro:", error);
      setSavedQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const setConfig = (config: QuizConfig) => {
    setCurrentQuiz((prev) => (prev ? { ...prev, config } : null));
  };

  const addQuestion = (question: QuizQuestion) => {
    setCurrentQuiz((prev) =>
      prev ? { ...prev, questoes: [...prev.questoes, question] } : null,
    );
  };

  const updateQuestion = (id: string, question: QuizQuestion) => {
    setCurrentQuiz((prev) =>
      prev
        ? {
            ...prev,
            questoes: prev.questoes.map((q) => (q.id === id ? question : q)),
          }
        : null,
    );
  };

  const deleteQuestion = (id: string) => {
    setCurrentQuiz((prev) =>
      prev
        ? { ...prev, questoes: prev.questoes.filter((q) => q.id !== id) }
        : null,
    );
  };

  const reorderQuestions = (fromIndex: number, toIndex: number) => {
    setCurrentQuiz((prev) => {
      if (!prev) return null;
      const newQuestoes = [...prev.questoes];
      const [removed] = newQuestoes.splice(fromIndex, 1);
      newQuestoes.splice(toIndex, 0, removed);
      return { ...prev, questoes: newQuestoes };
    });
  };

  const saveQuiz = async () => {
    if (!currentQuiz) return;
    try {
      const response = await fetch(`${API_URL}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentQuiz.id,
          professorEmail: PROFESSOR_EMAIL,
          title: currentQuiz.config.titulo || "Quiz sem título",
          config: currentQuiz.config,
          questions: currentQuiz.questoes,
        }),
      });

      if (!response.ok) throw new Error();

      showToast("Quiz salvo com sucesso!", "success");
      await loadQuizzes();
      resetCurrentQuiz();
    } catch (error) {
      showToast("Erro ao salvar quiz no servidor.", "error");
    }
  };

  const resetCurrentQuiz = () => {
    setCurrentQuiz({
      id: crypto.randomUUID(),
      config: {
        nivel: "A1",
        categorias: {
          texto: false,
          imagem: false,
          video: false,
          misturado: true,
        },
        tempoPorQuestao: 30,
        quantidadeQuestoes: 5,
      },
      questoes: [],
      criadoEm: new Date(),
    });
  };

  const deleteQuiz = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/quizzes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      showToast("Quiz excluído!", "success");
      await loadQuizzes();
    } catch (error) {
      showToast("Não foi possível excluir o quiz.", "error");
    }
  };

  return (
    <QuizContext.Provider
      value={{
        currentQuiz,
        savedQuizzes,
        setConfig,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        saveQuiz,
        deleteQuiz,
        resetCurrentQuiz,
        loadQuizzes,
      }}
    >
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((p) => ({ ...p, message: null }))}
      />
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuiz must be used within QuizProvider");
  return context;
};
