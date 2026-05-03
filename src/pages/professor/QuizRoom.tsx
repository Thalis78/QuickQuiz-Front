import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Users, Play, ArrowRight, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout";
import { ConfirmModal } from "@/components/confirmModal";
import { useQuiz } from "@/contexts/QuizContext";
import { socketService } from "@/services/socketService";
import { Toast } from "@/components/toast"; // Importação correta do seu componente

export const QuizRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const { savedQuizzes } = useQuiz();

  const [roomCode, setRoomCode] = useState<string>("");
  const [roomUrl, setRoomUrl] = useState<string>("");
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answeredStudents, setAnsweredStudents] = useState<Set<string>>(
    new Set(),
  );
  const [quiz, setQuiz] = useState<any>(null);
  const [startModal, setStartModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  // Estado para o seu Toast customizado
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

  const createSocketRoom = useCallback(
    (selectedQuiz: any) => {
      socketService.createRoom(selectedQuiz, (response) => {
        if (response.success) {
          const code = response.code;
          setRoomCode(code);
          const url = `${window.location.origin}/aluno/entrar/${code}`;
          setRoomUrl(url);
          showToast(`Sala criada! Código: ${code}`, "success");
        } else {
          showToast(response.error || "Erro ao criar sala.", "error");
          navigate("/professor/dashboard");
        }
      });
    },
    [navigate, showToast],
  );

  useEffect(() => {
    const selectedQuiz = savedQuizzes.find((q) => q.id === quizId);
    if (!selectedQuiz) {
      showToast("Quiz não encontrado.", "error");
      navigate("/professor/dashboard");
      return;
    }

    setQuiz(selectedQuiz);

    if (!socketService.isConnected()) {
      socketService
        .connect()
        .then(() => {
          createSocketRoom(selectedQuiz);
        })
        .catch(() => {
          showToast("Não foi possível conectar ao servidor.", "error");
          navigate("/professor/dashboard");
        });
    } else {
      createSocketRoom(selectedQuiz);
    }

    // Listeners do Socket
    socketService.onStudentJoined((data) => {
      setTotalStudents(data.totalStudents);
      showToast(`${data.student.name} entrou na sala.`, "success");
    });

    socketService.onStudentLeft((data) => {
      setTotalStudents(data.totalStudents);
      showToast(`${data.studentName} saiu da sala.`, "error");
    });

    socketService.onStudentAnswered((data) => {
      setAnsweredStudents((prev) => new Set(prev).add(data.studentId));
    });

    socketService.onNextQuestion((data) => {
      setCurrentQuestionIndex(data.questionIndex);
      setAnsweredStudents(new Set());
      showToast(`Questão ${data.questionIndex + 1} iniciada.`, "success");
    });

    socketService.onQuizFinished(() => {
      showToast("Quiz finalizado!", "success");
      setTimeout(() => {
        navigate("/professor/dashboard");
      }, 2000);
    });

    return () => {
      socketService.off("student-joined");
      socketService.off("student-left");
      socketService.off("student-answered");
      socketService.off("next-question");
      socketService.off("quiz-finished");
    };
  }, [quizId, savedQuizzes, navigate, createSocketRoom, showToast]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    showToast("Código copiado!", "success");
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(roomUrl);
    showToast("Link copiado!", "success");
  };

  const handleStartQuiz = () => {
    if (totalStudents === 0) {
      showToast("Aguarde pelo menos 1 aluno entrar.", "error");
      return;
    }

    if (isPlaying) return;

    setIsPlaying(true);
    socketService.startQuiz(roomCode, (response) => {
      if (response.success) {
        setCurrentQuestionIndex(0);
        setAnsweredStudents(new Set());
        showToast("Quiz iniciado!", "success");
      } else {
        setIsPlaying(false);
        showToast(response.error || "Erro ao iniciar quiz.", "error");
      }
    });
  };

  const handleNextQuestion = () => {
    socketService.nextQuestion(roomCode, (response) => {
      if (response.success) {
        if (response.finished) {
          showToast("Quiz finalizado!", "success");
          navigate("/professor/dashboard");
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setAnsweredStudents(new Set());
          showToast(`Questão ${currentQuestionIndex + 2} iniciada.`, "success");
        }
      } else {
        showToast(response.error || "Não foi possível avançar.", "error");
      }
    });
  };

  const handleCloseRoom = () => {
    socketService.closeRoom(roomCode);
    showToast("Sala encerrada.", "success");
    navigate("/professor/dashboard");
  };

  if (!quiz || !roomCode) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#605BEF]">
        <div className="text-white text-xl">Criando sala...</div>
      </div>
    );
  }

  return (
    <Layout>
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((prev) => ({ ...prev, message: null }))}
      />

      <main className="relative z-10 flex flex-col items-center px-4 pt-32 pb-12">
        <div className="bg-[#3E3B7A] text-white px-12 py-4 rounded-xl mb-8 font-bold text-2xl text-center">
          {isPlaying
            ? `Quiz em Andamento - Questão ${currentQuestionIndex + 1}/${quiz.questoes.length}`
            : "Sala de Espera"}
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#605BEF] mb-6 text-center">
              QR Code da Sala
            </h2>

            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border-4 border-[#605BEF]">
                <QRCodeSVG
                  value={roomUrl}
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="w-full mb-4">
                <p className="text-gray-600 text-sm font-semibold mb-2 text-center">
                  Código da Sala
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#F0EFFF] px-6 py-4 rounded-lg text-center">
                    <span className="text-4xl font-bold text-[#605BEF] tracking-wider">
                      {roomCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="bg-[#605BEF] text-white p-4 rounded-lg"
                  >
                    <Copy size={24} />
                  </button>
                </div>
              </div>

              <div className="w-full mb-6 text-center">
                <p className="text-gray-600 text-sm font-semibold mb-2">
                  Link Direto
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#F0EFFF] px-4 py-3 rounded-lg truncate text-[#605BEF] font-mono text-sm">
                    {roomUrl}
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className="bg-[#605BEF] text-white p-3 rounded-lg"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#605BEF] flex items-center gap-2 mb-6">
              <Users size={28} /> Alunos ({totalStudents})
            </h2>

            {isPlaying ? (
              <div>
                <div className="bg-gradient-to-r from-[#605BEF] to-[#7B73E8] text-white p-6 rounded-xl mb-6">
                  <h3 className="text-2xl font-bold mb-4">
                    Questão {currentQuestionIndex + 1} de {quiz.questoes.length}
                  </h3>
                  <p className="text-lg mb-4">
                    {quiz.questoes[currentQuestionIndex].enunciado}
                  </p>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span>Progresso:</span>
                      <span className="font-bold">
                        {answeredStudents.size}/{totalStudents}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-[#00D9B5] h-3 rounded-full transition-all"
                        style={{
                          width: `${totalStudents > 0 ? (answeredStudents.size / totalStudents) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-[#00D9B5] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 mb-3"
                >
                  {currentQuestionIndex < quiz.questoes.length - 1 ? (
                    <>
                      Próxima Questão <ArrowRight size={24} />
                    </>
                  ) : (
                    <>
                      Finalizar Quiz <CheckCircle size={24} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCloseModal(true)}
                  className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Encerrar Quiz
                </button>
              </div>
            ) : (
              <div>
                {totalStudents === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Users size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">
                      Nenhum aluno conectado
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold">
                      <Users size={24} /> {totalStudents} aluno(s) pronto(s)
                    </div>
                  </div>
                )}
                <div className="space-y-3 mt-6">
                  <button
                    onClick={() => setStartModal(true)}
                    disabled={totalStudents === 0}
                    className="w-full bg-[#00D9B5] disabled:bg-gray-300 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3"
                  >
                    <Play size={24} /> Iniciar Quiz
                  </button>
                  <button
                    onClick={() => setCloseModal(true)}
                    className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Fechar Sala
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={startModal}
        onClose={() => setStartModal(false)}
        onConfirm={handleStartQuiz}
        title="Iniciar Quiz"
        description={`Iniciar com ${totalStudents} aluno(s)?`}
        confirmText="Iniciar"
        variant="success"
      />

      <ConfirmModal
        isOpen={closeModal}
        onClose={() => setCloseModal(false)}
        onConfirm={handleCloseRoom}
        title="Fechar Sala"
        description="Encerrar esta sala?"
        confirmText="Fechar"
        variant="danger"
      />
    </Layout>
  );
};
