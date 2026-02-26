import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useQuiz } from '@/contexts/QuizContext';
import { toast } from '@/hooks/use-toast';

export const CreateQuizStep1: React.FC = () => {
  const navigate = useNavigate();
  const { currentQuiz, setConfig } = useQuiz();
  
  const [titulo, setTitulo] = useState('');
  const [nivel, setNivel] = useState(currentQuiz?.config.nivel || 'A1');
  const [categorias, setCategorias] = useState(
    currentQuiz?.config.categorias || {
      texto: false,
      imagem: false,
      video: false,
      misturado: true
    }
  );
  const [tempo, setTempo] = useState(currentQuiz?.config.tempoPorQuestao?.toString() || '30');
  const [quantidade, setQuantidade] = useState(currentQuiz?.config.quantidadeQuestoes?.toString() || '5');

  const handleCategoriaToggle = (categoria: keyof typeof categorias) => {
    setCategorias(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  const handleProximaEtapa = () => {
    if (!titulo.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, digite um título para o quiz.',
        variant: 'destructive',
      });
      return;
    }

    const tempoNum = parseInt(tempo);
    const quantidadeNum = parseInt(quantidade);

    if (!tempoNum || tempoNum <= 0) {
      toast({
        title: 'Tempo inválido',
        description: 'O tempo por questão deve ser maior que 0.',
        variant: 'destructive',
      });
      return;
    }

    if (!quantidadeNum || quantidadeNum <= 0) {
      toast({
        title: 'Quantidade inválida',
        description: 'A quantidade de questões deve ser maior que 0.',
        variant: 'destructive',
      });
      return;
    }

    const algumaSelecionada = Object.values(categorias).some(v => v);
    if (!algumaSelecionada) {
      toast({
        title: 'Categoria obrigatória',
        description: 'Selecione pelo menos uma categoria.',
        variant: 'destructive',
      });
      return;
    }

    setConfig({
      nivel,
      categorias,
      tempoPorQuestao: tempoNum,
      quantidadeQuestoes: quantidadeNum,
      titulo,
    });

    toast({
      title: 'Configurações salvas!',
      description: 'Agora adicione as questões do quiz.',
    });

    navigate('/professor/quiz/criar/etapa-2');
  };

  return (
    <div className="w-full min-h-screen relative bg-[#605BEF]">
      <div className="fixed inset-0 w-full h-full z-0">
        <img src="/bg.svg" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

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
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Título do Quiz *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Quiz de Inglês - Nível Básico"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Nível das questões *
              </label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-48 px-4 py-3 rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="A1">A1 - Iniciante</option>
                <option value="A2">A2 - Elementar</option>
                <option value="B1">B1 - Intermediário</option>
                <option value="B2">B2 - Usuário Independente</option>
                <option value="C1">C1 - Proficiência Operativa</option>
                <option value="C2">C2 - Maestria</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Tipo de questões *
              </label>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">Texto</span>
                  <button
                    type="button"
                    onClick={() => handleCategoriaToggle('texto')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      categorias.texto ? 'bg-purple-500' : 'bg-gray-400'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        categorias.texto ? 'translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">Imagem</span>
                  <button
                    type="button"
                    onClick={() => handleCategoriaToggle('imagem')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      categorias.imagem ? 'bg-purple-500' : 'bg-gray-400'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        categorias.imagem ? 'translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">Vídeo</span>
                  <button
                    type="button"
                    onClick={() => handleCategoriaToggle('video')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      categorias.video ? 'bg-purple-500' : 'bg-gray-400'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        categorias.video ? 'translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="w-px h-8 bg-white/30" />

                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">Misturado</span>
                  <button
                    type="button"
                    onClick={() => handleCategoriaToggle('misturado')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      categorias.misturado ? 'bg-[#00D9B5]' : 'bg-gray-400'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        categorias.misturado ? 'translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Tempo por questão (segundos) *
              </label>
              <input
                type="number"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                placeholder="30"
                min="5"
                max="300"
                className="w-64 px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-3 text-lg">
                Quantidade de questões *
              </label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="5"
                min="1"
                max="50"
                className="w-64 px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
    </div>
  );
};
