import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useQuiz } from '@/contexts/QuizContext';
import { toast } from '@/hooks/use-toast';

export const CreateQuizStep3: React.FC = () => {
  const navigate = useNavigate();
  const { currentQuiz, saveQuiz } = useQuiz();

  const questoes = currentQuiz?.questoes || [];
  const config = currentQuiz?.config;

  const handleVoltar = () => {
    navigate('/professor/quiz/criar/etapa-2');
  };

  const handleConfirmar = () => {
    if (!currentQuiz) {
      toast({
        title: 'Erro',
        description: 'Nenhum quiz encontrado para salvar.',
        variant: 'destructive',
      });
      return;
    }

    saveQuiz();
    toast({
      title: 'Quiz criado com sucesso!',
      description: 'Seu quiz foi salvo e está pronto para ser usado.',
    });
    navigate('/professor/dashboard');
  };

  const handleCancelar = () => {
    if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      navigate('/professor/dashboard');
    }
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
          <div className="text-white text-2xl font-bold mb-6">3 / 3</div>

          <h2 className="text-white text-center text-3xl font-bold mb-6">
            Revisão Final
          </h2>

          {config && (
            <div className="bg-[#5B54D8] rounded-2xl p-6 mb-6">
              <h3 className="text-white font-bold text-xl mb-4">Configurações do Quiz</h3>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div>
                  <p className="text-white/70 text-sm">Título:</p>
                  <p className="font-semibold">{config.titulo}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Nível:</p>
                  <p className="font-semibold">{config.nivel}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Tempo por questão:</p>
                  <p className="font-semibold">{config.tempoPorQuestao} segundos</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total de questões:</p>
                  <p className="font-semibold">{questoes.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Perguntas */}
          <div className="space-y-4 mb-10">
            <h3 className="text-white font-bold text-xl mb-4">Questões Criadas</h3>
            
            {questoes.map((pergunta, index) => {
              const respostaCorreta = pergunta.alternativas.find(a => a.correta);
              const letraCorreta = respostaCorreta
                ? String.fromCharCode(65 + pergunta.alternativas.indexOf(respostaCorreta))
                : '';

              return (
                <div
                  key={pergunta.id}
                  className="bg-[#7B73E8] rounded-2xl p-6 shadow-lg"
                >
                  <h4 className="text-white font-bold text-lg mb-3">
                    Pergunta {index + 1}
                  </h4>

                  <div className="mb-3">
                    <p className="text-white/80 text-sm mb-1">Enunciado:</p>
                    <div className="bg-white rounded-lg px-4 py-2">
                      <p className="text-gray-800">{pergunta.enunciado}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-white/80 text-sm mb-2">Alternativas:</p>
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

                  <div>
                    <p className="text-white/80 text-sm mb-1">Resposta Correta:</p>
                    <div className="bg-[#00D9B5] inline-block rounded-lg px-4 py-2">
                      <p className="text-white font-bold">
                        {letraCorreta} - {respostaCorreta?.texto}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleVoltar}
              className="bg-[#5B54D8] hover:bg-[#4B44C8] text-white px-10 py-3 rounded-full font-bold text-lg transition-colors flex items-center gap-2"
            >
              <span>←</span> Voltar
            </button>
            <button
              onClick={handleConfirmar}
              className="bg-[#00D9B5] hover:bg-[#00C9A5] text-white px-10 py-3 rounded-full font-bold text-lg transition-colors shadow-lg"
            >
              Confirmar
            </button>
            <button
              onClick={handleCancelar}
              className="bg-[#E84855] hover:bg-[#D83845] text-white px-10 py-3 rounded-full font-bold text-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
