import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Timer, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout";
import { socketService } from "@/services/socketService";
import { Toast } from "@/components/toast";
import { QuestionData } from "@/types/type";

export const StudentQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams<{ code: string }>();

  const [studentId, setStudentId] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null,
  );
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const storedStudentId = sessionStorage.getItem("studentId");
    const storedStudentName = sessionStorage.getItem("studentName");

    if (!storedStudentId || !storedStudentName) {
      showToast("Sessão inválida. Faça login novamente.", "error");
      navigate(`/aluno/entrar/${code}`);
      return;
    }

    setStudentId(storedStudentId);
    setStudentName(storedStudentName);

    const questionData = (location.state as any)?.questionData;
    if (questionData) {
      setCurrentQuestion(questionData.question);
      setQuestionIndex(questionData.questionIndex);
      setTotalQuestions(questionData.totalQuestions);
      setTimeRemaining(questionData.timeLimit);
    }

    socketService.onNextQuestion((data) => {
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTimeRemaining(data.timeLimit);
      setSelectedAnswer("");
      setHasAnswered(false);
    });

    socketService.onQuizFinished((data) => {
      navigate(`/aluno/resultados/${code}`, {
        state: { results: data.results },
      });
    });

    socketService.onRoomClosed(() => {
      showToast("O professor encerrou a sala.", "error");
      navigate("/");
    });

    return () => {
      socketService.off("next-question");
      socketService.off("quiz-finished");
      socketService.off("room-closed");
    };
  }, [code, navigate, location.state, showToast]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [questionIndex, currentQuestion]);

  const handleSubmitAnswer = (answer: string) => {
    if (hasAnswered || !code) return;

    setIsLoading(true);
    setHasAnswered(true);

    socketService.submitAnswer(
      code,
      studentId,
      questionIndex,
      answer,
      (response) => {
        setIsLoading(false);
        if (response.success) {
          showToast(answer ? "Resposta enviada!" : "Tempo esgotado", "success");
        } else {
          showToast("Erro ao enviar resposta.", "error");
          setHasAnswered(false);
        }
      },
    );
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnswer) {
      showToast("Selecione uma alternativa!", "error");
      return;
    }
    handleSubmitAnswer(selectedAnswer);
  };

  if (!currentQuestion) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#605BEF]">
        <div className="text-white text-xl">Carregando questão...</div>
      </div>
    );
  }

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <Layout>
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((prev) => ({ ...prev, message: null }))}
      />

      <main className="relative z-10 flex flex-col items-center px-4 pt-32 pb-12">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm">Aluno</p>
                <p className="text-[#605BEF] font-bold text-lg">
                  {studentName}
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Questão</p>
                <p className="text-2xl font-bold text-[#605BEF]">
                  {questionIndex + 1} / {totalQuestions}
                </p>
              </div>

              <div
                className={`text-center px-6 py-3 rounded-xl transition-colors ${
                  timeRemaining <= 5
                    ? "bg-red-500 animate-pulse"
                    : "bg-[#605BEF]"
                }`}
              >
                <Timer size={24} className="text-white mx-auto mb-1" />
                <p className="text-white font-bold text-2xl">
                  {timeRemaining}s
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#00D9B5] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl mb-6">
            <h2 className="text-2xl font-bold text-[#605BEF] mb-6">
              {currentQuestion.enunciado}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.alternativas.map((alt, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedAnswer === letter;

                return (
                  <button
                    key={index}
                    onClick={() =>
                      !hasAnswered &&
                      timeRemaining > 0 &&
                      setSelectedAnswer(letter)
                    }
                    disabled={hasAnswered || timeRemaining === 0}
                    className={`p-6 rounded-xl text-left transition-all transform disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-[#605BEF] text-white shadow-xl scale-[1.02]"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    } ${hasAnswered || timeRemaining === 0 ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isSelected
                            ? "bg-white text-[#605BEF]"
                            : "bg-[#605BEF] text-white"
                        }`}
                      >
                        {letter}
                      </div>
                      <p className="flex-1 text-lg font-medium">{alt.texto}</p>
                      {isSelected && !hasAnswered && (
                        <CheckCircle size={24} className="text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {!hasAnswered && timeRemaining > 0 && (
            <div className="text-center">
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedAnswer || isLoading}
                className="bg-[#00D9B5] hover:bg-[#00C9A5] disabled:bg-gray-400 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
              >
                {isLoading ? "Enviando..." : "Confirmar Resposta"}
              </button>
            </div>
          )}

          {hasAnswered && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
              <p className="text-emerald-800 font-bold text-lg">
                ✅ Resposta registrada!{" "}
                {questionIndex < totalQuestions - 1
                  ? "Aguarde a próxima questão..."
                  : "Aguarde o resultado final..."}
              </p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};
