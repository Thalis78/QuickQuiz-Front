import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Toast } from "@/components/toast";
import { Users, Timer, Trophy, Play, Copy, ArrowLeft } from "lucide-react";
import { getRoom } from "@/api/sala";

export const QuizRoom: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [salaInfo, setSalaInfo] = useState({
    titulo: "Carregando...",
    nivel: "-",
    quantidade: 0,
    tempo: 0,
    jogadoresConectados: 0,
    alunosLista: [] as Array<{ nome: string; score: number }>,
  });

  useEffect(() => {
    const fetchSala = async () => {
      try {
        const sala = await getRoom(codigo!);

        setSalaInfo({
          titulo: sala.titulo,
          nivel: sala.nivel,
          quantidade: sala.quantidadeQuestoes,
          tempo: sala.tempoPorQuestao,
          jogadoresConectados: sala.alunos ? sala.alunos.length : 0,
          alunosLista: sala.alunos || [],
        });
      } catch (error: any) {
        setToastMessage(error.message || "Erro ao carregar dados da sala.");
      } finally {
        setIsLoading(false);
      }
    };

    if (codigo) {
      fetchSala();

      const interval = setInterval(() => {
        fetchSala();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [codigo]);

  const copiarCodigo = () => {
    if (codigo) {
      navigator.clipboard.writeText(codigo);
      setToastMessage("Código copiado!");
    }
  };

  const handleVoltar = () => {
    navigate("/professor/dashboard");
  };

  return (
    <Layout>
      <Toast
        message={toastMessage}
        variant="success"
        onClose={() => setToastMessage(null)}
      />

      <div className="flex flex-col items-center px-4 py-20 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-4xl flex items-center justify-start mb-12">
          <button
            type="button"
            onClick={handleVoltar}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Painel</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#3E3B7A] rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
              <h2 className="text-white/50 font-bold uppercase text-xs tracking-[0.2em] mb-3">
                Título do Quiz
              </h2>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
                {isLoading ? "..." : salaInfo.titulo}
              </h1>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center">
                  <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <span className="block text-white font-black text-xl">
                    {salaInfo.nivel}
                  </span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    Nível
                  </span>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center">
                  <Timer className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <span className="block text-white font-black text-xl">
                    {salaInfo.tempo}s
                  </span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    Tempo
                  </span>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center">
                  <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <span className="block text-white font-black text-xl">
                    {salaInfo.jogadoresConectados}
                  </span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    Alunos
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#3E3B7A] rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
              <h3 className="text-white font-black text-2xl mb-6 text-center sm:text-left">
                {salaInfo.alunosLista.length === 0
                  ? "Aguardando Alunos..."
                  : "Alunos na Sala"}
              </h3>

              {salaInfo.alunosLista.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Users className="w-12 h-12 text-white/20" />
                  </div>
                  <p className="text-white/50 font-medium max-w-sm">
                    A partida começará assim que os alunos entrarem usando o
                    código ao lado.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {salaInfo.alunosLista.map((aluno, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                        {index + 1}
                      </div>
                      <span className="truncate text-lg">{aluno.nome}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center">
              <span className="text-[#3E3B7A]/40 font-black uppercase text-xs tracking-widest mb-6">
                Código da Sala
              </span>
              <div className="text-6xl font-black text-[#3E3B7A] tracking-tighter mb-10">
                {codigo}
              </div>
              <button
                onClick={copiarCodigo}
                className="w-full flex items-center justify-center gap-3 bg-[#3E3B7A] text-white py-5 rounded-2xl font-black hover:bg-[#2D2A5E] transition-all active:scale-95 shadow-xl"
              >
                <Copy className="w-5 h-5" />
                Copiar Código
              </button>
            </div>

            <button
              disabled={isLoading || salaInfo.alunosLista.length === 0}
              className="w-full flex items-center justify-center gap-3 bg-green-500 text-white py-7 rounded-[2.5rem] font-black text-2xl shadow-[0_12px_0_rgb(21,128,61)] hover:shadow-[0_6px_0_rgb(21,128,61)] hover:translate-y-[6px] transition-all active:translate-y-[12px] active:shadow-none disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:translate-y-0"
            >
              INICIAR AGORA
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
