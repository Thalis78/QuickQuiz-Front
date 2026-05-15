import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Toast } from "@/components/toast";
import { Users, Timer, Trophy } from "lucide-react";
import { getRoom } from "@/api/sala";

export const StudentWaitingRoom: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [salaInfo, setSalaInfo] = useState({
    titulo: "Carregando...",
    nivel: "-",
    tempo: 0,
    jogadoresConectados: 0,
  });

  useEffect(() => {
    const verificarSala = async () => {
      try {
        const sala = await getRoom(codigo!);

        setSalaInfo({
          titulo: sala.titulo,
          nivel: sala.nivel,
          tempo: sala.tempoPorQuestao,
          jogadoresConectados: sala.alunos ? sala.alunos.length : 0,
        });
      } catch (error: any) {
        setToastMessage(error.message || "Erro ao atualizar dados da sala.");
      } finally {
        setIsLoading(false);
      }
    };

    if (codigo) {
      verificarSala();
      const interval = setInterval(verificarSala, 2000);
      return () => clearInterval(interval);
    }
  }, [codigo]);

  return (
    <Layout>
      <Toast
        message={toastMessage}
        variant="error"
        onClose={() => setToastMessage(null)}
      />

      <div className="flex flex-col items-center px-4 py-20 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#3E3B7A] rounded-2xl p-6 border border-white/10 flex items-center gap-4 shadow-xl">
            <div className="p-3 bg-yellow-400/10 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <span className="block text-white/50 text-xs font-bold uppercase tracking-wider">
                Nível
              </span>
              <span className="text-white font-black text-xl">
                {salaInfo.nivel}
              </span>
            </div>
          </div>

          <div className="bg-[#3E3B7A] rounded-2xl p-6 border border-white/10 flex items-center gap-4 shadow-xl">
            <div className="p-3 bg-blue-400/10 rounded-xl">
              <Timer className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="block text-white/50 text-xs font-bold uppercase tracking-wider">
                Tempo por Questão
              </span>
              <span className="text-white font-black text-xl">
                {salaInfo.tempo}s
              </span>
            </div>
          </div>

          <div className="bg-[#3E3B7A] rounded-2xl p-6 border border-white/10 flex items-center gap-4 shadow-xl">
            <div className="p-3 bg-green-400/10 rounded-xl">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <span className="block text-white/50 text-xs font-bold uppercase tracking-wider">
                Jogadores na Sala
              </span>
              <span className="text-white font-black text-xl">
                {salaInfo.jogadoresConectados}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl bg-[#3E3B7A] rounded-[2.5rem] p-10 border border-white/10 shadow-2xl flex flex-col items-center text-center justify-center min-h-[400px]">
          <h2 className="text-white/50 font-bold uppercase text-sm tracking-[0.2em] mb-4">
            Você está na sala de espera
          </h2>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-10 max-w-xl leading-tight">
            {isLoading ? "Buscando informações..." : salaInfo.titulo}
          </h1>

          <div className="relative flex items-center justify-center mb-10">
            <div className="absolute w-28 h-28 bg-[#605BEF]/20 rounded-full animate-ping" />
            <div className="absolute w-20 h-20 bg-[#605BEF]/40 rounded-full animate-pulse" />
            <div className="relative w-14 h-14 bg-[#605BEF] rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>

          <h3 className="text-white font-black text-2xl mb-2">Prepare-se!</h3>
          <p className="text-white/60 font-medium max-w-sm">
            O jogo vai começar assim que o professor der o comando de início no
            painel principal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 text-white/40 font-bold hover:text-white transition-colors text-sm"
        >
          Sair da Sala
        </button>
      </div>
    </Layout>
  );
};
