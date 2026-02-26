import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Medal, Award, Home } from 'lucide-react';
import { Header } from '@/components/Header';

interface Result {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
}

export const StudentResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState<Result[]>([]);
  const [myResult, setMyResult] = useState<Result | null>(null);
  const [myPosition, setMyPosition] = useState<number>(0);

  useEffect(() => {
    const studentId = sessionStorage.getItem('studentId');
    const resultsData = location.state?.results as Result[];

    if (!resultsData || !studentId) {
      navigate('/');
      return;
    }

    setResults(resultsData);
    
    const myIndex = resultsData.findIndex(r => r.id === studentId);
    if (myIndex !== -1) {
      setMyResult(resultsData[myIndex]);
      setMyPosition(myIndex + 1);
    }

    // Limpa sessionStorage
    sessionStorage.removeItem('studentId');
    sessionStorage.removeItem('studentName');
  }, [location, navigate]);

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy size={40} className="text-yellow-400" />;
      case 2:
        return <Medal size={40} className="text-gray-400" />;
      case 3:
        return <Award size={40} className="text-orange-600" />;
      default:
        return null;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-[#605BEF] to-[#7B73E8]';
    }
  };

  if (!myResult) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#605BEF]">
        <div className="text-white text-xl">Carregando resultados...</div>
      </div>
    );
  }

  const percentage = Math.round((myResult.score / myResult.totalQuestions) * 100);

  return (
    <div className="w-full min-h-screen relative bg-[#605BEF]">
      <div className="fixed inset-0 w-full h-full z-0">
        <img src="/bg.svg" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-10 flex flex-col items-center px-4 pt-32 pb-12">
        <div className="w-full max-w-5xl">
          <h1 className="text-white text-center text-4xl font-bold mb-8">
            🎉 Resultados do Quiz
          </h1>

          {/* Seu Resultado */}
          <div className={`bg-gradient-to-r ${getPositionColor(myPosition)} rounded-3xl p-8 shadow-2xl mb-8 text-white`}>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {getMedalIcon(myPosition) || (
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                    {myPosition}º
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-bold mb-2">{myResult.name}</h2>
              <p className="text-xl opacity-90">
                Você ficou em {myPosition}º lugar!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">Pontuação</p>
                <p className="text-3xl font-bold">{myResult.score}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">Total de Questões</p>
                <p className="text-3xl font-bold">{myResult.totalQuestions}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">Aproveitamento</p>
                <p className="text-3xl font-bold">{percentage}%</p>
              </div>
            </div>
          </div>

          {/* Ranking Completo */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#605BEF] mb-6 text-center">
              🏆 Ranking Geral
            </h3>

            <div className="space-y-3">
              {results.map((result, index) => {
                const position = index + 1;
                const isMe = result.id === myResult.id;
                const resultPercentage = Math.round((result.score / result.totalQuestions) * 100);

                return (
                  <div
                    key={result.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isMe
                        ? 'bg-[#605BEF] text-white shadow-lg scale-105'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      position <= 3
                        ? 'bg-gradient-to-br ' + getPositionColor(position) + ' text-white'
                        : isMe
                          ? 'bg-white text-[#605BEF]'
                          : 'bg-[#605BEF] text-white'
                    }`}>
                      {position}
                    </div>

                    <div className="flex-1">
                      <p className={`font-bold text-lg ${isMe ? 'text-white' : 'text-gray-800'}`}>
                        {result.name} {isMe && '(Você)'}
                      </p>
                      <p className={`text-sm ${isMe ? 'text-white/80' : 'text-gray-600'}`}>
                        {result.score} / {result.totalQuestions} questões corretas
                      </p>
                    </div>

                    <div className="text-right">
                      <p className={`text-2xl font-bold ${isMe ? 'text-white' : 'text-[#605BEF]'}`}>
                        {resultPercentage}%
                      </p>
                      {position <= 3 && getMedalIcon(position)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botão voltar */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="bg-white hover:bg-gray-100 text-[#605BEF] px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg inline-flex items-center gap-3"
            >
              <Home size={24} />
              Voltar para Início
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
