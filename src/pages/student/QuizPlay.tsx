import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Timer, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { socketService } from '@/services/socketService';
import { toast } from '@/hooks/use-toast';

interface QuestionData {
  enunciado: string;
  alternativas: { texto: string }[];
}

export const StudentQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams<{ code: string }>();
  
  const [studentId, setStudentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Recupera dados do sessionStorage
    const storedStudentId = sessionStorage.getItem('studentId');
    const storedStudentName = sessionStorage.getItem('studentName');
    
    if (!storedStudentId || !storedStudentName) {
      toast({
        title: 'Sessão inválida',
        description: 'Faça login novamente.',
        variant: 'destructive',
      });
      navigate(`/aluno/entrar/${code}`);
      return;
    }

    setStudentId(storedStudentId);
    setStudentName(storedStudentName);

    // Carrega dados da primeira questão se vieram do state (navegação da sala de espera)
    const questionData = (location.state as any)?.questionData;
    if (questionData) {
      console.log('📝 Carregando questão do state:', questionData);
      console.log(`⏱️ Questão ${questionData.questionIndex + 1} - Timer configurado: ${questionData.timeLimit}s`);
      setCurrentQuestion(questionData.question);
      setQuestionIndex(questionData.questionIndex);
      setTotalQuestions(questionData.totalQuestions);
      setTimeLimit(questionData.timeLimit);
      setTimeRemaining(questionData.timeLimit);
    }

    // Listener para próxima questão
    socketService.onNextQuestion((data) => {
      console.log(`⏭️ Próxima questão recebida! Timer estava em: ${timeRemaining}s`);
      console.log(`📝 Nova questão ${data.questionIndex + 1}/${totalQuestions}`);
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTimeLimit(data.timeLimit);
      setTimeRemaining(data.timeLimit);
      setSelectedAnswer('');
      setHasAnswered(false);
    });

    // Listener para quiz finalizado
    socketService.onQuizFinished((data) => {
      navigate(`/aluno/resultados/${code}`, { state: { results: data.results } });
    });

    // Listener para sala fechada
    socketService.onRoomClosed(() => {
      toast({
        title: 'Sala fechada',
        description: 'O professor encerrou a sala.',
        variant: 'destructive',
      });
      navigate('/');
    });

    return () => {
      socketService.off('next-question');
      socketService.off('quiz-finished');
      socketService.off('room-closed');
    };
  }, [code, navigate]);

  // Timer countdown - continua mesmo após responder
  useEffect(() => {
    // Só cria timer se tiver tempo restante
    if (timeRemaining <= 0) return;

    console.log(`⏱️ Timer iniciado: ${timeRemaining}s (Questão ${questionIndex + 1})`);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          console.log(`⏰ Timer frontend chegou a 0! Questão ${questionIndex + 1}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log(`🛑 Limpando timer da questão ${questionIndex + 1}`);
      clearInterval(timer);
    };
  }, [questionIndex, timeLimit]); // Recria apenas quando muda de questão

  const handleSelectAnswer = (letter: string) => {
    if (hasAnswered || timeRemaining === 0) return;
    setSelectedAnswer(letter);
  };

  const handleSubmitAnswer = (answer: string) => {
    if (hasAnswered || !code) return;

    setIsLoading(true);
    setHasAnswered(true);

    socketService.submitAnswer(code, studentId, questionIndex, answer, (response) => {
      setIsLoading(false);
      if (response.success) {
        toast({
          title: answer ? 'Resposta enviada!' : 'Tempo esgotado',
          description: answer ? 'Aguarde a pr\u00f3xima quest\u00e3o.' : 'Sua resposta n\u00e3o foi registrada.',
        });
      }
    });
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnswer) {
      toast({
        title: 'Selecione uma alternativa',
        description: 'Escolha uma resposta antes de confirmar.',
        variant: 'destructive',
      });
      return;
    }
    handleSubmitAnswer(selectedAnswer);
  };

  if (!currentQuestion) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#605BEF]">
        <div className="text-white text-xl">Carregando quest\u00e3o...</div>
      </div>
    );
  }

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full min-h-screen relative bg-[#605BEF]">
      <div className="fixed inset-0 w-full h-full z-0">
        <img src="/bg.svg" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-10 flex flex-col items-center px-4 pt-32 pb-12">
        <div className="w-full max-w-4xl">
          {/* Header com timer e progresso */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm">Aluno</p>
                <p className="text-[#605BEF] font-bold text-lg">{studentName}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Questão</p>
                <p className="text-2xl font-bold text-[#605BEF]">
                  {questionIndex + 1} / {totalQuestions}
                </p>
              </div>

              <div className={`text-center px-6 py-3 rounded-xl ${
                timeRemaining <= 5 ? 'bg-red-500 animate-pulse' : 'bg-[#605BEF]'
              }`}>
                <Timer size={24} className="text-white mx-auto mb-1" />
                <p className="text-white font-bold text-2xl">{timeRemaining}s</p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-[#00D9B5] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Quest\u00e3o */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl mb-6">
            <h2 className="text-2xl font-bold text-[#605BEF] mb-6">
              {currentQuestion.enunciado}
            </h2>

            {/* Alternativas */}
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.alternativas.map((alt, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedAnswer === letter;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(letter)}
                    disabled={hasAnswered || timeRemaining === 0}
                    className={`p-6 rounded-xl text-left transition-all transform hover:scale-102 disabled:cursor-not-allowed ${
                      isSelected
                        ? 'bg-[#605BEF] text-white shadow-xl scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    } ${hasAnswered || timeRemaining === 0 ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                        isSelected ? 'bg-white text-[#605BEF]' : 'bg-[#605BEF] text-white'
                      }`}>
                        {letter}
                      </div>
                      <p className="flex-1 text-lg">{alt.texto}</p>
                      {isSelected && !hasAnswered && (
                        <CheckCircle size={28} className="text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bot\u00e3o confirmar */}
          {!hasAnswered && timeRemaining > 0 && (
            <div className="text-center">
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedAnswer || isLoading}
                className="bg-[#00D9B5] hover:bg-[#00C9A5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold text-lg transition-all shadow-lg transform hover:scale-105"
              >
                {isLoading ? 'Enviando...' : 'Confirmar Resposta'}
              </button>
            </div>
          )}

          {hasAnswered && (
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-6 text-center">
              <p className="text-yellow-800 font-bold text-lg">
                ✅ Resposta enviada! {questionIndex < totalQuestions - 1 ? `Aguarde a questão ${questionIndex + 2}...` : 'Aguarde o resultado final...'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
