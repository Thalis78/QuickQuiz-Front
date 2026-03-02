import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogIn, ArrowLeft } from "lucide-react";
import { socketService } from "@/services/socketService";
import { toast } from "sonner";
import { Layout } from "@/components/layout";

export const StudentJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const { code: urlCode } = useParams<{ code?: string }>();

  const [roomCode, setRoomCode] = useState(urlCode || "");
  const [studentName, setStudentName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!socketService.isConnected()) {
      socketService.connect().catch(() => {
        toast.error("Não foi possível conectar ao servidor. Tente novamente.");
      });
    }
  }, []);

  const handleJoinRoom = async () => {
    if (!studentName.trim()) {
      toast.error("Digite seu nome para entrar na sala.");
      return;
    }

    if (!roomCode.trim()) {
      toast.error("Digite o código da sala.");
      return;
    }

    if (!socketService.isConnected()) {
      try {
        await socketService.connect();
      } catch (error) {
        toast.error("Erro de conexão. Verifique sua internet.");
        return;
      }
    }

    setIsConnecting(true);

    socketService.joinRoom(roomCode.trim(), studentName.trim(), (response) => {
      setIsConnecting(false);

      if (response.success) {
        sessionStorage.setItem("studentId", response.studentId);
        sessionStorage.setItem("studentName", studentName.trim());
        sessionStorage.setItem("roomCode", roomCode.trim());

        if (response.quiz)
          sessionStorage.setItem("quizData", JSON.stringify(response.quiz));
        if (response.totalQuestions)
          sessionStorage.setItem(
            "totalQuestions",
            response.totalQuestions.toString(),
          );
        if (response.students)
          sessionStorage.setItem(
            "studentsList",
            JSON.stringify(response.students),
          );

        toast.success(`Bem-vindo à sala, ${studentName.trim()}!`);
        navigate(`/aluno/sala/${roomCode.trim()}`);
      } else {
        toast.error(response.error || "Não foi possível entrar na sala.");
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleJoinRoom();
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center px-4 pt-32 pb-12">
        <div className="w-full max-w-md bg-gray-50 rounded-2xl p-8 border-4 border-[#4441AA] shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#605BEF] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <LogIn size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#605BEF] text-center mb-2">
              Entrar na Sala
            </h2>
            <p className="text-gray-600 text-center text-sm">
              Identifique-se para começar o quiz
            </p>
          </div>

          <div className="space-y-5 w-full">
            {/* Nome do aluno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#605BEF] focus:border-transparent outline-none transition"
                maxLength={50}
                autoFocus
              />
            </div>

            {/* Código da sala */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código da Sala
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyPress={handleKeyPress}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#605BEF] focus:border-transparent outline-none transition text-center text-2xl font-bold tracking-widest"
                maxLength={6}
                disabled={!!urlCode}
              />
              {urlCode && (
                <p className="text-xs text-[#605BEF] mt-2 text-center font-medium">
                  Código detectado via link
                </p>
              )}
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={isConnecting}
              className="w-full bg-[#605BEF] text-white py-4 rounded-lg font-bold hover:bg-[#4f4bd9] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {isConnecting ? "Conectando..." : "Entrar na Sala"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
              <span>💡</span> Aguarde o professor iniciar a partida após entrar.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-[#605BEF] hover:underline text-sm font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Voltar para o início
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};
