import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { useQuiz, QuizQuestion } from '@/contexts/QuizContext';
import { toast } from '@/hooks/use-toast';

export const CreateQuizStep2: React.FC = () => {
  const navigate = useNavigate();
  const { currentQuiz, addQuestion, updateQuestion, deleteQuestion, reorderQuestions } = useQuiz();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  
  // Estado do formulário do modal
  const [enunciado, setEnunciado] = useState('');
  const [alternativaA, setAlternativaA] = useState('');
  const [alternativaB, setAlternativaB] = useState('');
  const [alternativaC, setAlternativaC] = useState('');
  const [alternativaD, setAlternativaD] = useState('');
  const [respostaCorreta, setRespostaCorreta] = useState<'A' | 'B' | 'C' | 'D' | ''>('');

  const questoes = currentQuiz?.questoes || [];

  const openModal = (question?: QuizQuestion) => {
    if (question) {
      setEditingQuestion(question);
      setEnunciado(question.enunciado);
      setAlternativaA(question.alternativas[0]?.texto || '');
      setAlternativaB(question.alternativas[1]?.texto || '');
      setAlternativaC(question.alternativas[2]?.texto || '');
      setAlternativaD(question.alternativas[3]?.texto || '');
      
      const corretaIndex = question.alternativas.findIndex(a => a.correta);
      setRespostaCorreta(corretaIndex >= 0 ? String.fromCharCode(65 + corretaIndex) as 'A' | 'B' | 'C' | 'D' : '');
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setEnunciado('');
    setAlternativaA('');
    setAlternativaB('');
    setAlternativaC('');
    setAlternativaD('');
    setRespostaCorreta('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveQuestion = () => {
    // Validações
    if (!enunciado.trim()) {
      toast({
        title: 'Enunciado obrigatório',
        description: 'Digite a pergunta.',
        variant: 'destructive',
      });
      return;
    }

    if (!alternativaA.trim() || !alternativaB.trim() || !alternativaC.trim() || !alternativaD.trim()) {
      toast({
        title: 'Alternativas incompletas',
        description: 'Preencha todas as 4 alternativas.',
        variant: 'destructive',
      });
      return;
    }

    if (!respostaCorreta) {
      toast({
        title: 'Resposta correta não selecionada',
        description: 'Marque qual alternativa é a correta.',
        variant: 'destructive',
      });
      return;
    }

    const newQuestion: QuizQuestion = {
      id: editingQuestion?.id || `q_${Date.now()}`,
      enunciado: enunciado.trim(),
      alternativas: [
        { texto: alternativaA.trim(), correta: respostaCorreta === 'A' },
        { texto: alternativaB.trim(), correta: respostaCorreta === 'B' },
        { texto: alternativaC.trim(), correta: respostaCorreta === 'C' },
        { texto: alternativaD.trim(), correta: respostaCorreta === 'D' },
      ],
      tipo: 'texto',
    };

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, newQuestion);
      toast({
        title: 'Questão atualizada!',
        description: 'A questão foi editada com sucesso.',
      });
    } else {
      addQuestion(newQuestion);
      toast({
        title: 'Questão adicionada!',
        description: 'Nova questão criada com sucesso.',
      });
    }

    closeModal();
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Tem certeza que deseja apagar esta questão?')) {
      deleteQuestion(id);
      toast({
        title: 'Questão removida',
        description: 'A questão foi deletada.',
      });
    }
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questoes.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    reorderQuestions(index, targetIndex);
  };

  const handleVoltar = () => {
    navigate('/professor/quiz/criar/etapa-1');
  };

  const handleProximaEtapa = () => {
    if (questoes.length === 0) {
      toast({
        title: 'Adicione questões',
        description: 'Você precisa adicionar pelo menos 1 questão.',
        variant: 'destructive',
      });
      return;
    }

    navigate('/professor/quiz/criar/etapa-3');
  };

  return (
    <div className="w-full min-h-screen relative bg-[#605BEF]">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <img src="/bg.svg" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-10 flex flex-col items-center px-4 pt-32 pb-12">
        {/* Título */}
        <div className="bg-[#3E3B7A] text-white px-12 py-4 rounded-xl mb-8 font-bold text-2xl">
          Criar Quiz
        </div>

        {/* Card Principal */}
        <div className="w-full max-w-4xl bg-[#3E3B7A] rounded-3xl p-8 shadow-2xl">
          <div className="text-white text-2xl font-bold mb-6">2 / 3</div>

          <h2 className="text-white text-center text-3xl font-bold mb-6">
            Adicione suas questões
          </h2>

          {/* Botão Adicionar Pergunta */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => openModal()}
              className="bg-[#7B73E8] hover:bg-[#6B63D8] text-white px-8 py-3 rounded-full font-bold text-lg transition-colors"
            >
              + Adicionar Pergunta
            </button>
          </div>

          {questoes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white text-xl font-semibold mb-4">
                Lista de Perguntas ({questoes.length})
              </h3>
              
              <div className="space-y-4">
                {questoes.map((pergunta, index) => (
                  <div key={pergunta.id} className="bg-[#7B73E8] rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveQuestion(index, 'up')}
                          disabled={index === 0}
                          className="text-white hover:text-gray-200 disabled:opacity-30"
                        >
                          <ChevronUp size={20} />
                        </button>
                        <button
                          onClick={() => handleMoveQuestion(index, 'down')}
                          disabled={index === questoes.length - 1}
                          className="text-white hover:text-gray-200 disabled:opacity-30"
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-2">
                          Pergunta {index + 1}
                        </h4>
                        
                        <div className="bg-white rounded-lg px-4 py-3 mb-3">
                          <p className="text-gray-800">{pergunta.enunciado}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {pergunta.alternativas.map((alt, i) => (
                            <div
                              key={i}
                              className={`px-3 py-2 rounded-lg text-sm ${
                                alt.correta
                                  ? 'bg-[#00D9B5] text-white font-semibold'
                                  : 'bg-white/20 text-white'
                              }`}
                            >
                              <span className="font-bold">{String.fromCharCode(65 + i)}</span> {alt.texto}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(pergunta)}
                          className="bg-[#5B54D8] hover:bg-[#4B44C8] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(pergunta.id)}
                          className="bg-[#E84855] hover:bg-[#D83845] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          ✖️ Apagar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {questoes.length === 0 && (
            <div className="text-center py-12 text-white/60">
              <p className="text-lg">Nenhuma questão adicionada ainda.</p>
              <p className="text-sm mt-2">Clique em "Adicionar Pergunta" para começar.</p>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={handleVoltar}
              className="bg-[#5B54D8] hover:bg-[#4B44C8] text-white px-8 py-3 rounded-full font-bold text-lg transition-colors flex items-center gap-2"
            >
              <span>←</span> Voltar
            </button>
            <button
              onClick={handleProximaEtapa}
              className="bg-[#7B73E8] hover:bg-[#6B63D8] text-white px-8 py-3 rounded-full font-bold text-lg transition-colors flex items-center gap-2"
            >
              Próxima etapa <span>→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingQuestion ? 'Editar Questão' : 'Adicionar Questão'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Enunciado da questão *
                </label>
                <textarea
                  value={enunciado}
                  onChange={(e) => setEnunciado(e.target.value)}
                  placeholder="Digite a pergunta..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Alternativas *
                </label>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="flex items-center justify-center w-8 h-10 bg-purple-500 text-white font-bold rounded">
                      A
                    </span>
                    <input
                      type="text"
                      value={alternativaA}
                      onChange={(e) => setAlternativaA(e.target.value)}
                      placeholder="Alternativa A"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                      type="radio"
                      name="correta"
                      checked={respostaCorreta === 'A'}
                      onChange={() => setRespostaCorreta('A')}
                      className="w-5 h-5 mt-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <span className="flex items-center justify-center w-8 h-10 bg-purple-500 text-white font-bold rounded">
                      B
                    </span>
                    <input
                      type="text"
                      value={alternativaB}
                      onChange={(e) => setAlternativaB(e.target.value)}
                      placeholder="Alternativa B"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                      type="radio"
                      name="correta"
                      checked={respostaCorreta === 'B'}
                      onChange={() => setRespostaCorreta('B')}
                      className="w-5 h-5 mt-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <span className="flex items-center justify-center w-8 h-10 bg-purple-500 text-white font-bold rounded">
                      C
                    </span>
                    <input
                      type="text"
                      value={alternativaC}
                      onChange={(e) => setAlternativaC(e.target.value)}
                      placeholder="Alternativa C"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                      type="radio"
                      name="correta"
                      checked={respostaCorreta === 'C'}
                      onChange={() => setRespostaCorreta('C')}
                      className="w-5 h-5 mt-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <span className="flex items-center justify-center w-8 h-10 bg-purple-500 text-white font-bold rounded">
                      D
                    </span>
                    <input
                      type="text"
                      value={alternativaD}
                      onChange={(e) => setAlternativaD(e.target.value)}
                      placeholder="Alternativa D"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                      type="radio"
                      name="correta"
                      checked={respostaCorreta === 'D'}
                      onChange={() => setRespostaCorreta('D')}
                      className="w-5 h-5 mt-2"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  * Marque o círculo da alternativa correta
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {editingQuestion ? 'Salvar Alterações' : 'Adicionar Questão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
