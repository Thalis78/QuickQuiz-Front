import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, Clock, BookOpen, LogOut, Info } from "lucide-react";
import { ConfirmModal } from "@/components/confirmModal";
import { socketService } from "@/services/socketService";
import { Toast } from "@/components/toast";
import { Layout } from "@/components/layout";
import { Quiz, Student } from "@/types/type";

export const StudentWaitingRoom: React.FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const [studentId, setStudentId] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [leaveModal, setLeaveModal] = useState(false);

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
    if (!code) {
      navigate("/");
      return;
    }

    const storedStudentId = sessionStorage.getItem("studentId");
    const storedStudentName = sessionStorage.getItem("studentName");
    const storedRoomCode = sessionStorage.getItem("roomCode");

    if (!storedStudentId || !storedStudentName || storedRoomCode !== code) {
      showToast("Sessão inválida. Faça login novamente.", "error");
      navigate(`/aluno/entrar/${code}`);
      return;
    }

    setStudentId(storedStudentId);
    setStudentName(storedStudentName);

    const storedQuiz = sessionStorage.getItem("quizData");
    if (storedQuiz) {
      try {
        setQuiz(JSON.parse(storedQuiz));
      } catch (error) {
        console.error("Erro ao parsear quiz:", error);
      }
    }

    const storedStudentsList = sessionStorage.getItem("studentsList");
    if (storedStudentsList) {
      try {
        const parsedStudents = JSON.parse(storedStudentsList);
        setStudents(parsedStudents);
        setTotalStudents(parsedStudents.length);
      } catch (error) {
        console.error("Erro ao parsear lista de alunos:", error);
      }
    }

    socketService.onStudentJoined((data) => {
      setTotalStudents(data.totalStudents);
      setStudents((prev) => {
        const exists = prev.some((s) => s.id === data.student.id);
        if (exists) return prev;
        return [...prev, data.student];
      });
      if (data.student.id !== storedStudentId) {
        showToast(`${data.student.name} entrou na sala.`, "success");
      }
    });

    socketService.onStudentLeft((data) => {
      setTotalStudents(data.totalStudents);
      setStudents((prev) => prev.filter((s) => s.id !== data.studentId));
      if (data.studentId !== storedStudentId) {
        showToast(`${data.studentName} saiu da sala.`, "error");
      }
    });

    socketService.onQuizStarted((data) => {
      showToast("Quiz iniciado! Boa sorte!", "success");
      setTimeout(() => {
        navigate(`/aluno/quiz/${code}`, { state: { questionData: data } });
      }, 500);
    });

    socketService.onRoomClosed(() => {
      showToast("O professor encerrou a sala.", "error");
      navigate("/");
    });

    return () => {
      socketService.off("student-joined");
      socketService.off("student-left");
      socketService.off("quiz-started");
      socketService.off("room-closed");
    };
  }, [code, navigate, showToast]);

  const handleLeaveRoom = () => {
    if (!code || !studentId) return;
    socketService.leaveRoom(code, studentId);
    showToast("Você saiu da sala.", "success");
    sessionStorage.clear();
    navigate("/");
  };

  if (!studentName) {
    return (
      <Layout>
        <div className="flex items-center justify-center pt-32">
          <div className="text-[#605BEF] text-xl font-bold animate-pulse">
            Carregando sala...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((prev) => ({ ...prev, message: null }))}
      />

      <main className="flex flex-col items-center px-4 pt-32 pb-12">
        <div className="w-full max-w-4xl space-y-6">
          <div className="bg-gray-50 rounded-3xl p-8 border-4 border-[#4441AA] shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-6 py-2 rounded-full font-bold text-sm md:text-base mb-6 border border-amber-200">
                <Clock size={20} className="animate-pulse" />
                AGUARDANDO O PROFESSOR INICIAR...
              </div>

              <h1 className="text-3xl font-bold text-[#605BEF] mb-2">
                Sala de Espera
              </h1>
              <p className="text-gray-600">
                Prepare-se,{" "}
                <span className="font-bold text-[#4441AA]">{studentName}</span>!
              </p>
            </div>

            {quiz && (
              <div className="bg-[#605BEF] rounded-2xl p-6 text-white mb-8 shadow-inner">
                <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
                  <BookOpen size={24} />
                  <h2 className="text-xl font-bold uppercase tracking-tight truncate">
                    {quiz.config.titulo}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/10 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-white/70 text-[10px] uppercase font-black">
                      Nível
                    </p>
                    <p className="text-lg font-bold">{quiz.config.nivel}</p>
                  </div>
                  <div className="bg-black/10 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-white/70 text-[10px] uppercase font-black">
                      Questões
                    </p>
                    <p className="text-lg font-bold">{quiz.questoes.length}</p>
                  </div>
                  <div className="bg-black/10 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-white/70 text-[10px] uppercase font-black">
                      Tempo
                    </p>
                    <p className="text-lg font-bold">
                      {quiz.config.tempoPorQuestao}s
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users size={22} className="text-[#605BEF]" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Participantes
                  </h3>
                </div>
                <span className="bg-[#605BEF] text-white px-3 py-1 rounded-full text-xs font-bold">
                  {totalStudents} conectados
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      student.id === studentId
                        ? "bg-indigo-50 border-[#605BEF]"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        student.id === studentId
                          ? "bg-[#605BEF] text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <p
                      className={`font-semibold truncate ${student.id === studentId ? "text-[#605BEF]" : "text-gray-700"}`}
                    >
                      {student.name}{" "}
                      {student.id === studentId && (
                        <span className="text-[10px] font-normal opacity-70">
                          (Você)
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border-2 border-dashed border-[#605BEF]/40 shadow-sm flex gap-4">
            <div className="bg-[#605BEF]/10 p-3 rounded-full h-fit">
              <Info className="text-[#605BEF]" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#605BEF] mb-1">Dica:</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mantenha esta tela aberta. O início será automático. Prepare-se
                para o desafio!
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setLeaveModal(true)}
              className="group text-gray-400 hover:text-red-500 font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <LogOut
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Sair desta sala
            </button>
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={leaveModal}
        onClose={() => setLeaveModal(false)}
        onConfirm={handleLeaveRoom}
        title="Sair da Sala"
        description="Deseja realmente sair da espera?"
        confirmText="Sair Agora"
        variant="danger"
      />
    </Layout>
  );
};
