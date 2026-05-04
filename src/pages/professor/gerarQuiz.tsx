import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { Toast } from "@/components/toast";
import { Layout } from "@/components/layout";
import { FormField, FormInput } from "@/components/formComponents";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CreateQuizStep1: React.FC = () => {
  const navigate = useNavigate();
  const { currentQuiz, setConfig } = useQuiz();

  const [toastConfig, setToastConfig] = useState<{
    message: string | null;
    variant: "success" | "error";
  }>({
    message: null,
    variant: "success",
  });

  const [formData, setFormData] = useState({
    titulo: currentQuiz?.config.titulo || "",
    nivel: currentQuiz?.config.nivel || "Fácil",
    quantidade: currentQuiz?.config.quantidadeQuestoes?.toString() || "5",
    tempoPorQuestao: currentQuiz?.config.tempoPorQuestao?.toString() || "30",
  });

  const showToast = (
    message: string,
    variant: "success" | "error" = "success",
  ) => {
    setToastConfig({ message, variant });
  };

  const handleProximaEtapa = () => {
    const { titulo, nivel, quantidade, tempoPorQuestao } = formData;
    const quantidadeNum = parseInt(quantidade);
    const tempoNum = parseInt(tempoPorQuestao);

    if (!titulo.trim()) {
      return showToast("Dê um nome ao seu quiz!", "error");
    }

    if (!nivel) {
      return showToast("Selecione um nível de dificuldade!", "error");
    }

    if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
      return showToast(
        "A quantidade de questões deve ser no mínimo 1.",
        "error",
      );
    }

    if (quantidadeNum > 20) {
      return showToast("O limite máximo é de 20 questões.", "error");
    }

    if (isNaN(tempoNum) || tempoNum < 5) {
      return showToast("O tempo mínimo por questão é de 5 segundos.", "error");
    }

    setConfig({
      ...currentQuiz?.config,
      titulo,
      nivel,
      quantidadeQuestoes: quantidadeNum,
      tempoPorQuestao: tempoNum,
    });

    showToast("Configurações salvas!", "success");

    setTimeout(() => {
      navigate("/professor/quiz/criar/etapa-2");
    }, 800);
  };

  return (
    <Layout>
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((prev) => ({ ...prev, message: null }))}
      />

      <div className="flex flex-col items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
            Novo Quiz
          </h1>
          <p className="text-white/70 font-medium italic">
            Configure as regras da partida
          </p>
        </div>

        <div className="w-full max-w-2xl bg-[#3E3B7A] rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/10">
          <div className="space-y-6">
            <FormInput
              label="Nome do Quiz"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              placeholder="Ex: Verb to Be - Practice"
              className="w-full bg-white border-none text-slate-900 text-lg py-6 px-6 rounded-xl shadow-inner"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Dificuldade">
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mt-1">
                  {["Fácil", "Médio", "Difícil"].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setFormData({ ...formData, nivel: op })}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all duration-200 ${
                        formData.nivel === op
                          ? "bg-white text-[#3E3B7A] shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.05]"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormInput
                label="Nº de Questões (Máx 20)"
                type="number"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({ ...formData, quantidade: e.target.value })
                }
                min="1"
                max="20"
                className="bg-white border-none text-slate-900 py-3 rounded-xl font-bold"
              />

              <div className="md:col-span-2 relative">
                <FormInput
                  label="Tempo por questão (segundos)"
                  type="number"
                  value={formData.tempoPorQuestao}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tempoPorQuestao: e.target.value,
                    })
                  }
                  min="5"
                  className="bg-white border-none text-[#3E3B7A] py-4 pl-6 pr-16 rounded-xl text-xl font-black"
                />
                <span className="absolute right-4 bottom-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  Segs
                </span>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/professor/dashboard")}
                className="group flex items-center gap-2 text-white/60 font-bold hover:text-white transition-all py-2"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                onClick={handleProximaEtapa}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-white border-2 border-white/40 px-12 py-3.5 rounded-full font-black text-lg hover:bg-white hover:text-[#3E3B7A] hover:border-white transition-all active:scale-95"
              >
                Próxima Etapa
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
