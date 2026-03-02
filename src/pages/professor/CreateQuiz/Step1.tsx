import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { FormToggle, FormField, FormInput } from "@/components/formComponents";

export const CreateQuizStep1: React.FC = () => {
  const navigate = useNavigate();
  const { currentQuiz, setConfig } = useQuiz();

  const [titulo, setTitulo] = useState("");
  const [nivel, setNivel] = useState(currentQuiz?.config.nivel || "A1");
  const [categorias, setCategorias] = useState(
    currentQuiz?.config.categorias || {
      texto: false,
      imagem: false,
      video: false,
      misturado: true,
    },
  );
  const [tempo, setTempo] = useState(
    currentQuiz?.config.tempoPorQuestao?.toString() || "30",
  );
  const [quantidade, setQuantidade] = useState(
    currentQuiz?.config.quantidadeQuestoes?.toString() || "5",
  );

  const handleCategoriaToggle = (categoria: keyof typeof categorias) => {
    setCategorias((prev) => ({ ...prev, [categoria]: !prev[categoria] }));
  };

  const handleProximaEtapa = () => {
    const tempoNum = parseInt(tempo);
    const quantidadeNum = parseInt(quantidade);

    if (!titulo.trim())
      return toast({ title: "Título obrigatório", variant: "destructive" });
    if (!tempoNum || tempoNum <= 0)
      return toast({ title: "Tempo inválido", variant: "destructive" });
    if (!quantidadeNum || quantidadeNum <= 0)
      return toast({ title: "Quantidade inválida", variant: "destructive" });
    if (!Object.values(categorias).some((v) => v))
      return toast({
        title: "Selecione uma categoria",
        variant: "destructive",
      });

    setConfig({
      nivel,
      categorias,
      tempoPorQuestao: tempoNum,
      quantidadeQuestoes: quantidadeNum,
      titulo,
    });
    toast({ title: "Configurações salvas!" });
    navigate("/professor/quiz/criar/etapa-2");
  };

  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center px-4 pt-32 pb-12">
        <div className="bg-[#3E3B7A] text-white px-12 py-4 rounded-xl mb-8 font-bold text-2xl">
          Criar Quiz
        </div>

        <div className="w-full max-w-3xl bg-[#3E3B7A] rounded-3xl p-8 shadow-2xl">
          <div className="text-white text-2xl font-bold mb-6">1 / 3</div>
          <h2 className="text-white text-center text-3xl font-bold mb-8">
            Configuração do Quiz
          </h2>

          <div className="space-y-6">
            <FormInput
              label="Título do Quiz *"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Quiz de Inglês"
            />

            <FormField label="Nível das questões *">
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-48 px-4 py-3 rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Tipo de questões *">
              <div className="flex items-center gap-6 flex-wrap">
                {(["texto", "imagem", "video"] as const).map((cat) => (
                  <FormToggle
                    key={cat}
                    label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                    checked={categorias[cat]}
                    onChange={() => handleCategoriaToggle(cat)}
                  />
                ))}
                <div className="w-px h-8 bg-white/30" />
                <FormToggle
                  label="Misturado"
                  checked={categorias.misturado}
                  onChange={() => handleCategoriaToggle("misturado")}
                  activeColor="bg-[#00D9B5]"
                />
              </div>
            </FormField>

            <div className="flex gap-4">
              <FormInput
                label="Tempo (seg)"
                type="number"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                className="w-32"
              />
              <FormInput
                label="Quantidade"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-32"
              />
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleProximaEtapa}
              className="bg-[#7B73E8] hover:bg-[#6B63D8] text-white px-10 py-3 rounded-full font-bold text-lg transition-colors flex items-center gap-2"
            >
              Próxima etapa <span>→</span>
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};
