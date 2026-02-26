import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Users, Play, X, ArrowRight, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useQuiz } from '@/contexts/QuizContext';
import { socketService } from '@/services/socketService';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  joinedAt: Date;
}

export const QuizRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const { savedQuizzes } = useQuiz();
  
  const [roomCode, setRoomCode] = useState<string>('');
  const [roomUrl, setRoomUrl] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answeredStudents, setAnsweredStudents] = useState<Set<string>>(new Set());
  const [quiz, setQuiz] = useState<any>(null);
  const [startModal, setStartModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  useEffect(() => {
    const selectedQuiz = savedQuizzes.find(q => q.id === quizId);
    if (!selectedQuiz) {
      toast.error('Quiz não encontrado.');
      navigate('/professor/dashboard');
      return;
    }

    setQuiz(selectedQuiz);

    // Conecta ao Socket.IO
    if (!socketService.isConnected()) {
      socketService.connect().then(() => {
        createSocketRoom(selectedQuiz);
      }).catch((error) => {
        toast.error('Não foi possível conectar ao servidor.');
        navigate('/professor/dashboard');
      });
    } else {
      createSocketRoom(selectedQuiz);
    }

    // Listeners
    socketService.onStudentJoined((data) => {
      setTotalStudents(data.totalStudents);
      toast.success(`${data.student.name} entrou na sala.`);
    });

    socketService.onStudentLeft((data) => {
      setTotalStudents(data.totalStudents);
      toast.info(`${data.studentName} saiu da sala.`);
    });

    socketService.onStudentAnswered((data) => {
      setAnsweredStudents(prev => new Set(prev).add(data.studentId));
    });

    // Listener para próxima questão (avanço automático)
    socketService.onNextQuestion((data) => {
      setCurrentQuestionIndex(data.questionIndex);
      setAnsweredStudents(new Set());
      toast.info(`Questão ${data.questionIndex + 1} iniciada automaticamente.`);
    });

    // Listener para quiz finalizado (avanço automático)
    socketService.onQuizFinished(() => {
      toast.success('Quiz finalizado! Todos os alunos verão os resultados.');
      setTimeout(() => {
        navigate('/professor/dashboard');
      }, 2000);
    });

    return () => {
      socketService.off('student-joined');
      socketService.off('student-left');
      socketService.off('student-answered');
      socketService.off('next-question');
      socketService.off('quiz-finished');
    };
  }, [quizId, savedQuizzes, navigate]);

  const createSocketRoom = (selectedQuiz: any) => {
    socketService.createRoom(selectedQuiz, (response) => {
      if (response.success) {
        const code = response.code;
        setRoomCode(code);
        const url = `${window.location.origin}/aluno/entrar/${code}`;
        setRoomUrl(url);
        
        toast.success(`Sala criada! Código: ${code}`);
      } else {
        toast.error(response.error || 'Erro ao criar sala.');
        navigate('/professor/dashboard');
      }
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast.success('Código copiado!');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(roomUrl);
    toast.success('Link copiado!');
  };

  const handleStartQuiz = () => {
    if (totalStudents === 0) {
      toast.error('Aguarde pelo menos 1 aluno entrar na sala.');
      return;
    }

    // Previne double-click
    if (isPlaying) {
      console.log('⚠️ Quiz já iniciado - ignorando clique');
      return;
    }

    // Desabilita botão imediatamente
    setIsPlaying(true);
    
    socketService.startQuiz(roomCode, (response) => {
      if (response.success) {
        setCurrentQuestionIndex(0);
        setAnsweredStudents(new Set());
        toast.success('Quiz iniciado para todos os alunos!');
      } else {
        // Reverte estado se houver erro
        setIsPlaying(false);
        toast.error(response.error || 'Erro ao iniciar quiz.');
      }
    });
  };

  const handleNextQuestion = () => {
    socketService.nextQuestion(roomCode, (response) => {
      if (response.success) {
        if (response.finished) {
          toast.success('Quiz finalizado! Todos os alunos verão os resultados.');
          navigate('/professor/dashboard');
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setAnsweredStudents(new Set());
          toast.success(`Questão ${currentQuestionIndex + 2} iniciada.`);
        }
      } else {
        toast.error(response.error || 'Não foi possível avançar.');
      }
    });
  };

  const handleCloseRoom = () => {
    socketService.closeRoom(roomCode);
    toast.success('Sala encerrada.');
    navigate('/professor/dashboard');
  };

  if (!quiz || !roomCode) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#605BEF]">
        <div className="text-white text-xl">Criando sala...</div>
      </div>
    );
  }

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
          {isPlaying ? `Quiz em Andamento - Questão ${currentQuestionIndex + 1}/${quiz.questoes.length}` : 'Sala de Espera'}
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card do QR Code */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#605BEF] mb-6 text-center">
              QR Code da Sala
            </h2>

            <div className="flex flex-col items-center">
              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border-4 border-[#605BEF]">
                <QRCodeSVG
                  value={roomUrl}
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Código da sala */}
              <div className="w-full mb-4">
                <p className="text-gray-600 text-sm font-semibold mb-2 text-center">
                  Código da Sala
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#F0EFFF] px-6 py-4 rounded-lg text-center">
                    <span className="text-4xl font-bold text-[#605BEF] tracking-wider">
                      {roomCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="bg-[#605BEF] hover:bg-[#4E4BC0] text-white p-4 rounded-lg transition-colors"
                    title="Copiar código"
                  >
                    <Copy size={24} />
                  </button>
                </div>
              </div>

              {/* URL da sala */}
              <div className="w-full mb-6">
                <p className="text-gray-600 text-sm font-semibold mb-2 text-center">
                  Link Direto
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#F0EFFF] px-4 py-3 rounded-lg">
                    <p className="text-[#605BEF] text-sm font-mono truncate">
                      {roomUrl}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className="bg-[#605BEF] hover:bg-[#4E4BC0] text-white p-3 rounded-lg transition-colors"
                    title="Copiar link"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              {/* Info do Quiz */}
              <div className="w-full bg-[#F0EFFF] rounded-xl p-4">
                <h3 className="text-[#605BEF] font-bold text-lg mb-2">
                  {quiz.config.titulo}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">Nível:</span> {quiz.config.nivel}
                  </div>
                  <div>
                    <span className="font-semibold">Questões:</span> {quiz.questoes.length}
                  </div>
                  <div>
                    <span className="font-semibold">Tempo:</span> {quiz.config.tempoPorQuestao}s
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={isPlaying ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
                      {isPlaying ? 'Em Andamento' : 'Aguardando'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card dos Alunos / Controle */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#605BEF] flex items-center gap-2">
                <Users size={28} />
                Alunos ({totalStudents})
              </h2>
            </div>

            {isPlaying ? (
              /* Controle do Quiz */
              <div>
                <div className="bg-gradient-to-r from-[#605BEF] to-[#7B73E8] text-white p-6 rounded-xl mb-6">
                  <h3 className="text-2xl font-bold mb-4">
                    Questão {currentQuestionIndex + 1} de {quiz.questoes.length}
                  </h3>
                  <p className="text-lg mb-4">
                    {quiz.questoes[currentQuestionIndex].enunciado}
                  </p>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm mb-2">Progresso das Respostas:</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/20 rounded-full h-4">
                        <div 
                          className="bg-[#00D9B5] h-4 rounded-full transition-all"
                          style={{ width: `${(answeredStudents.size / totalStudents) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold">
                        {answeredStudents.size}/{totalStudents}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-[#00D9B5] hover:bg-[#00C9A5] text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg mb-3"
                >
                  {currentQuestionIndex < quiz.questoes.length - 1 ? (
                    <>
                      Próxima Questão <ArrowRight size={24} />
                    </>
                  ) : (
                    <>
                      Finalizar Quiz <CheckCircle size={24} />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCloseModal(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Encerrar Quiz
                </button>
              </div>
            ) : (
              /* Sala de Espera */
              <div>
                {totalStudents === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Users size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Nenhum aluno conectado ainda</p>
                    <p className="text-sm mt-2">Compartilhe o QR Code ou código da sala</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="text-center py-8">
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-lg mb-4">
                        <Users size={24} />
                        {totalStudents} aluno(s) conectado(s)
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => setStartModal(true)}
                    disabled={totalStudents === 0}
                    className="w-full bg-[#00D9B5] hover:bg-[#00C9A5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg"
                  >
                    <Play size={24} />
                    Iniciar Quiz
                  </button>
                  
                  <button
                    onClick={() => setCloseModal(true)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Fechar Sala
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de confirmação para iniciar quiz */}
      <ConfirmModal
        isOpen={startModal}
        onClose={() => setStartModal(false)}
        onConfirm={handleStartQuiz}
        title="Iniciar Quiz"
        description={`Iniciar quiz com ${totalStudents} aluno(s) conectado(s)? O quiz começará imediatamente.`}
        confirmText="Iniciar"
        cancelText="Cancelar"
        variant="success"
      />

      {/* Modal de confirmação para fechar sala */}
      <ConfirmModal
        isOpen={closeModal}
        onClose={() => setCloseModal(false)}
        onConfirm={handleCloseRoom}
        title="Fechar Sala"
        description="Tem certeza que deseja fechar a sala? Todos os alunos serão desconectados e o quiz será encerrado."
        confirmText="Fechar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
