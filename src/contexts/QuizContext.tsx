import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface QuizQuestion {
  id: string;
  enunciado: string;
  alternativas: {
    texto: string;
    correta: boolean;
  }[];
  tipo: 'texto' | 'imagem' | 'video' | 'mista';
}

export interface QuizConfig {
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
}

export interface Quiz {
  id: string;
  config: QuizConfig;
  questoes: QuizQuestion[];
  criadoEm: Date;
}

interface QuizContextType {
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
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:3001/api';
const PROFESSOR_EMAIL = 'professor@ciel.com';

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>({
    id: crypto.randomUUID(),
    config: {
      nivel: 'A1',
      categorias: { texto: false, imagem: false, video: false, misturado: true },
      tempoPorQuestao: 30,
      quantidadeQuestoes: 5,
    },
    questoes: [],
    criadoEm: new Date(),
  });

  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar quizzes do Supabase ao montar
  useEffect(() => {
    loadQuizzes();
  }, []);

  const setConfig = (config: QuizConfig) => {
    setCurrentQuiz((prev) => prev ? { ...prev, config } : null);
  };

  const addQuestion = (question: QuizQuestion) => {
    setCurrentQuiz((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questoes: [...prev.questoes, question],
      };
    });
  };

  const updateQuestion = (id: string, question: QuizQuestion) => {
    setCurrentQuiz((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questoes: prev.questoes.map((q) => (q.id === id ? question : q)),
      };
    });
  };

  const deleteQuestion = (id: string) => {
    setCurrentQuiz((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questoes: prev.questoes.filter((q) => q.id !== id),
      };
    });
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentQuiz.id,
          professorEmail: PROFESSOR_EMAIL,
          title: currentQuiz.config.titulo || 'Quiz sem título',
          config: currentQuiz.config,
          questions: currentQuiz.questoes,
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar quiz');

      console.log('✅ Quiz salvo no Supabase');
      await loadQuizzes();
      
      // Reset para criar novo quiz
      setCurrentQuiz({
        id: crypto.randomUUID(),
        config: {
          nivel: 'A1',
          categorias: { texto: false, imagem: false, video: false, misturado: true },
          tempoPorQuestao: 30,
          quantidadeQuestoes: 5,
        },
        questoes: [],
        criadoEm: new Date(),
      });
    } catch (error) {
      console.error('❌ Erro ao salvar quiz:', error);
      toast.error('Erro ao salvar quiz. Verifique sua conexão.');
    }
  };

  const resetCurrentQuiz = () => {
    setCurrentQuiz({
      id: crypto.randomUUID(),
      config: {
        nivel: 'A1',
        categorias: { texto: false, imagem: false, video: false, misturado: true },
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
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar quiz');

      console.log('✅ Quiz deletado do Supabase');
      await loadQuizzes();
    } catch (error) {
      console.error('❌ Erro ao deletar quiz:', error);
      toast.error('Erro ao deletar quiz. Verifique sua conexão.');
    }
  };

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/quizzes/${PROFESSOR_EMAIL}`);
      
      if (!response.ok) throw new Error('Erro ao carregar quizzes');

      const data = await response.json();
      
      // Converter estrutura do Supabase para estrutura local
      const quizzes: Quiz[] = data.map((item: any) => ({
        id: item.id,
        config: item.config,
        questoes: item.questions,
        criadoEm: new Date(item.created_at),
      }));

      setSavedQuizzes(quizzes);
      console.log(`✅ ${quizzes.length} quizzes carregados do Supabase`);
    } catch (error) {
      console.error('❌ Erro ao carregar quizzes:', error);
      setSavedQuizzes([]);
    } finally {
      setLoading(false);
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
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};
