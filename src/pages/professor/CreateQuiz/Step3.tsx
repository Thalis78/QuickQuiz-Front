import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";

export const CreateQuizStep3: React.FC = () => {
  const navigate = useNavigate();
  const { currentQuiz, saveQuiz } = useQuiz();
  const questoes = currentQuiz?.questoes || [];
  const config = currentQuiz?.config;

  const handleConfirmar = () => {
    if (!currentQuiz)
      return toast({
        title: "Erro",
        description: "Quiz não encontrado.",
        variant: "destructive",
      });
    saveQuiz();
    toast({ title: "Quiz criado!", description: "Pronto para uso." });
    navigate("/professor/dashboard");
  };

  const handleCancelar = () => {
    if (confirm("Deseja cancelar? Dados serão perdidos."))
      navigate("/professor/dashboard");
  };

  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center px-4 pt-32 pb-12">
        <div className="bg-[#3E3B7A] text-white px-12 py-4 rounded-xl mb-8 font-bold text-2xl">
          Criar Quiz
        </div>

        <div className="w-full max-w-4xl bg-[#3E3B7A] rounded-3xl p-8 shadow-2xl">
          <div className="text-white text-2xl font-bold mb-6">3 / 3</div>
          <h2 className="text-white text-center text-3xl font-bold mb-6">
            Revisão Final
          </h2>

          {config && (
            <div className="bg-[#5B54D8] rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4 text-white">
              <div className="col-span-2 border-b border-white/20 pb-2 mb-2 font-bold text-xl">
                Configurações
              </div>
              <div>
                <p className="text-white/70 text-sm">Título:</p>
                <p className="font-semibold">{config.titulo}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Nível:</p>
                <p className="font-semibold">{config.nivel}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Tempo/Questão:</p>
                <p className="font-semibold">{config.tempoPorQuestao}s</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Total:</p>
                <p className="font-semibold">{questoes.length} questões</p>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-10">
            <h3 className="text-white font-bold text-xl mb-4">
              Questões Criadas
            </h3>
            {questoes.map((pergunta, index) => (
              <div
                key={pergunta.id}
                className="bg-[#7B73E8] rounded-2xl p-6 shadow-lg text-white"
              >
                <h4 className="font-bold text-lg mb-3">Pergunta {index + 1}</h4>
                <div className="bg-white rounded-lg px-4 py-2 mb-4 text-gray-800">
                  {pergunta.enunciado}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {pergunta.alternativas.map((alt, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded-lg text-sm ${alt.correta ? "bg-[#00D9B5] font-bold" : "bg-white/20"}`}
                    >
                      <span className="opacity-70 mr-1">
                        {String.fromCharCode(65 + i)}
                      </span>{" "}
                      {alt.texto}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/professor/quiz/criar/etapa-2")}
              className="bg-[#5B54D8] text-white px-10 py-3 rounded-full font-bold"
            >
              ← Voltar
            </button>
            <button
              onClick={handleConfirmar}
              className="bg-[#00D9B5] text-white px-10 py-3 rounded-full font-bold shadow-lg"
            >
              Confirmar
            </button>
            <button
              onClick={handleCancelar}
              className="bg-[#E84855] text-white px-10 py-3 rounded-full font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};
