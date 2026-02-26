import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { toast } from "sonner";
import { Layout } from "@/components/layout";

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { savedQuizzes, loadQuizzes, deleteQuiz } = useQuiz();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    quizId: "",
    quizTitle: "",
  });

  const [startModal, setStartModal] = useState({
    isOpen: false,
    quizId: "",
    quizTitle: "",
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado! Até logo!");
    navigate("/");
  };

  const handleDeleteQuiz = () => {
    deleteQuiz(deleteModal.quizId);
    toast.success(`"${deleteModal.quizTitle}" removido com sucesso.`);
    setDeleteModal({ isOpen: false, quizId: "", quizTitle: "" });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <main className="px-4 pt-32 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-4 border-[#4441AA]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#605BEF] mb-2">
                  Dashboard do Professor
                </h1>
                <p className="text-[#605BEF] font-bold text-lg">
                  Bem-vindo, {user?.name}!
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
              + Criar Novo Quiz
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-[#4441AA]">
            <h2 className="text-2xl font-bold text-[#605BEF] mb-6">
              Meus Quizzes ({savedQuizzes.length})
            </h2>

            {savedQuizzes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">Nenhum quiz criado ainda</p>
                <p className="text-sm mt-2">
                  Clique em "Criar Novo Quiz" para começar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-gradient-to-br from-[#605BEF] to-[#7B73E8] rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="flex flex-col h-full text-white">
                      <h3 className="font-bold text-xl mb-3 line-clamp-2">
                        {quiz.config.titulo}
                      </h3>

                      <div className="flex-1 space-y-2 mb-4 opacity-90">
                        <p className="text-sm">
                          📊 <b>Nível:</b> {quiz.config.nivel}
                        </p>
                        <p className="text-sm">
                          📝 <b>Questões:</b> {quiz.questoes.length}
                        </p>
                        <p className="text-sm">
                          ⏱️ <b>Tempo:</b> {quiz.config.tempoPorQuestao}s
                        </p>
                        <p className="text-xs">
                          📅 <b>Criado:</b>{" "}
                          {formatDate(new Date(quiz.criadoEm).getTime())}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() =>
                            setStartModal({
                              isOpen: true,
                              quizId: quiz.id,
                              quizTitle: quiz.config.titulo,
                            })
                          }
                          className="w-full bg-[#00D9B5] hover:bg-[#00C9A5] py-3 rounded-lg font-bold transition-colors shadow-lg"
                        >
                          🚀 Iniciar Quiz
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toast.info("Em breve!")}
                            className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg font-semibold text-xs transition-colors"
                          >
                            👁️ Ver
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                quizId: quiz.id,
                                quizTitle: quiz.config.titulo,
                              })
                            }
                            className="flex-1 bg-red-500/80 hover:bg-red-600 py-2 rounded-lg font-semibold text-xs transition-colors"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDeleteQuiz}
        title="Excluir Quiz"
        description={`Tem certeza que deseja excluir "${deleteModal.quizTitle}"?`}
        confirmText="Excluir"
      />

      <ConfirmModal
        isOpen={startModal.isOpen}
        onClose={() => setStartModal({ ...startModal, isOpen: false })}
        onConfirm={() => navigate(`/professor/quiz/sala/${startModal.quizId}`)}
        title="Iniciar Quiz"
        description={`Deseja iniciar o quiz "${startModal.quizTitle}"?`}
        confirmText="Iniciar"
        variant="success"
      />
    </Layout>
  );
};
