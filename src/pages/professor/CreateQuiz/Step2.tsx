import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { FormField } from "@/components/formComponents";
import { QuizQuestion} from "@/types/type";



export const CreateQuizStep2: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
  } = useQuiz();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null,
  );
  const [enunciado, setEnunciado] = useState("");
  const [alternativas, setAlternativas] = useState(["", "", "", ""]);
  const [respostaCorreta, setRespostaCorreta] = useState<number | null>(null);

  const questoes = currentQuiz?.questoes || [];

  const openModal = (question?: QuizQuestion) => {
    if (question) {
      setEditingQuestion(question);
      setEnunciado(question.enunciado);
      setAlternativas(question.alternativas.map((a) => a.texto));
      setRespostaCorreta(question.alternativas.findIndex((a) => a.correta));
    } else {
      setEditingQuestion(null);
      setEnunciado("");
      setAlternativas(["", "", "", ""]);
      setRespostaCorreta(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveQuestion = () => {
    if (
      !enunciado.trim() ||
      alternativas.some((a) => !a.trim()) ||
      respostaCorreta === null
    ) {
      return toast({
        title: "Campos incompletos",
        description:
          "Preencha o enunciado, todas as alternativas e marque a correta.",
        variant: "destructive",
      });
    }

    const newQuestion: QuizQuestion = {
      id: editingQuestion?.id || `q_${Date.now()}`,
      enunciado: enunciado.trim(),
      alternativas: alternativas.map((texto, i) => ({
        texto: texto.trim(),
        correta: i === respostaCorreta,
      })),
      tipo: "texto",
    };

    editingQuestion
      ? updateQuestion(editingQuestion.id, newQuestion)
      : addQuestion(newQuestion);
    toast({
      title: editingQuestion ? "Questão atualizada!" : "Questão adicionada!",
    });
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center px-4 pt-20 pb-12">
        <div className="bg-[#3E3B7A] text-white px-12 py-4 rounded-xl mb-8 font-bold text-2xl">
          Criar Quiz
        </div>

        <div className="w-full max-w-4xl bg-[#3E3B7A] rounded-3xl p-8 shadow-2xl">
          <div className="text-white text-2xl font-bold mb-6">2 / 3</div>
          <h2 className="text-white text-center text-3xl font-bold mb-6">
            Adicione suas questões
          </h2>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => openModal()}
              className="bg-[#7B73E8] hover:bg-[#6B63D8] text-white px-8 py-3 rounded-full font-bold text-lg transition-colors"
            >
              + Adicionar Pergunta
            </button>
          </div>

          <div className="space-y-4 mb-10">
            {questoes.map((pergunta, index) => (
              <div
                key={pergunta.id}
                className="bg-[#7B73E8] rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => reorderQuestions(index, index - 1)}
                    disabled={index === 0}
                    className="text-white disabled:opacity-30"
                  >
                    <ChevronUp size={20} />
                  </button>
                  <button
                    onClick={() => reorderQuestions(index, index + 1)}
                    disabled={index === questoes.length - 1}
                    className="text-white disabled:opacity-30"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-2">
                    Pergunta {index + 1}
                  </h4>
                  <div className="bg-white rounded-lg px-4 py-2 mb-3 text-gray-800">
                    {pergunta.enunciado}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {pergunta.alternativas.map((alt, i) => (
                      <div
                        key={i}
                        className={`px-3 py-2 rounded-lg text-sm ${alt.correta ? "bg-[#00D9B5] text-white font-bold" : "bg-white/20 text-white"}`}
                      >
                        <span className="font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>{" "}
                        {alt.texto}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openModal(pergunta)}
                    className="bg-[#5B54D8] text-white px-4 py-2 rounded-lg text-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() =>
                      confirm("Apagar?") && deleteQuestion(pergunta.id)
                    }
                    className="bg-[#E84855] text-white px-4 py-2 rounded-lg text-sm"
                  >
                    ✖️ Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => navigate("/professor/quiz/criar/etapa-1")}
              className="bg-[#5B54D8] text-white px-8 py-3 rounded-full font-bold"
            >
              ← Voltar
            </button>
            <button
              onClick={() =>
                questoes.length > 0
                  ? navigate("/professor/quiz/criar/etapa-3")
                  : toast({
                      title: "Adicione uma questão",
                      variant: "destructive",
                    })
              }
              className="bg-[#7B73E8] text-white px-8 py-3 rounded-full font-bold"
            >
              Próxima etapa →
            </button>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingQuestion ? "Editar" : "Adicionar"} Questão
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <FormField label="Enunciado da questão *">
                <textarea
                  value={enunciado}
                  onChange={(e) => setEnunciado(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                  rows={3}
                />
              </FormField>

              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold">
                  Alternativas (marque a correta) *
                </label>
                {alternativas.map((alt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="flex items-center justify-center w-8 h-10 bg-purple-500 text-white font-bold rounded">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      type="text"
                      value={alt}
                      onChange={(e) => {
                        const newAlt = [...alternativas];
                        newAlt[i] = e.target.value;
                        setAlternativas(newAlt);
                      }}
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="radio"
                      name="correta"
                      checked={respostaCorreta === i}
                      onChange={() => setRespostaCorreta(i)}
                      className="w-5 h-5"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveQuestion}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
