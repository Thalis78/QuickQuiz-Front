import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Clock, BookOpen, LogOut } from 'lucide-react';
import { Header } from '@/components/Header';
import { ConfirmModal } from '@/components/ConfirmModal';
import { socketService } from '@/services/socketService';
import { toast } from 'sonner';

interface QuizConfig {
  nivel: string;
  tempoPorQuestao: number;
  titulo: string;
}

interface Quiz {
  config: QuizConfig;
  questoes: any[];
}

interface Student {
  id: string;
  name: string;
  joinedAt: Date;
}

export const StudentWaitingRoom: React.FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  
  const [studentId, setStudentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [leaveModal, setLeaveModal] = useState(false);

  useEffect(() => {
    if (!code) {
      navigate('/');
      return;
    }

    // Recupera dados do sessionStorage
    const storedStudentId = sessionStorage.getItem('studentId');
    const storedStudentName = sessionStorage.getItem('studentName');
    const storedRoomCode = sessionStorage.getItem('roomCode');

    if (!storedStudentId || !storedStudentName || storedRoomCode !== code) {
      toast.error('Sessão inválida. Faça login novamente.');
      navigate(`/aluno/entrar/${code}`);
      return;
    }

    setStudentId(storedStudentId);
    setStudentName(storedStudentName);

    // Recupera dados do quiz do sessionStorage (foram salvos no join-room)
    const storedQuiz = sessionStorage.getItem('quizData');
    if (storedQuiz) {
      try {
        const parsedQuiz = JSON.parse(storedQuiz);
        setQuiz(parsedQuiz);
      } catch (error) {
        console.error('Erro ao parsear quiz:', error);
      }
    }
    
    // Recupera lista inicial de alunos
    const storedStudentsList = sessionStorage.getItem('studentsList');
    if (storedStudentsList) {
      try {
        const parsedStudents = JSON.parse(storedStudentsList);
        setStudents(parsedStudents);
        setTotalStudents(parsedStudents.length);
      } catch (error) {
        console.error('Erro ao parsear lista de alunos:', error);
      }
    }

    // Listeners Socket.IO
    socketService.onStudentJoined((data) => {
      setTotalStudents(data.totalStudents);
      
      // Adiciona aluno à lista se não for ele mesmo
      if (data.student.id !== storedStudentId) {
        setStudents(prev => {
          // Verifica se já existe
          const exists = prev.some(s => s.id === data.student.id);
          if (exists) return prev;
          return [...prev, data.student];
        });
        
        toast.success(`${data.student.name} entrou na sala.`);
      } else {
        // Se for o próprio aluno, adiciona à lista
        setStudents(prev => {
          const exists = prev.some(s => s.id === data.student.id);
          if (exists) return prev;
          return [...prev, data.student];
        });
      }
    });

    socketService.onStudentLeft((data) => {
      setTotalStudents(data.totalStudents);
      
      // Remove aluno da lista
      setStudents(prev => prev.filter(s => s.id !== data.studentId));
      
      if (data.studentId !== storedStudentId) {
        toast.info(`${data.studentName} saiu da sala.`);
      }
    });

    socketService.onQuizStarted((data) => {
      toast.success('Quiz iniciado! Boa sorte!');
      // Navega passando os dados da primeira questão
      navigate(`/aluno/quiz/${code}`, { 
        state: { 
          questionData: data 
        } 
      });
    });

    socketService.onRoomClosed(() => {
      toast.error('O professor encerrou a sala.');
      navigate('/');
    });

    return () => {
      socketService.off('student-joined');
      socketService.off('student-left');
      socketService.off('quiz-started');
      socketService.off('room-closed');
    };
  }, [code, navigate]);

  const handleLeaveRoom = () => {
    if (!code || !studentId) return;

    socketService.leaveRoom(code, studentId);
    
    toast.success('Você saiu da sala. Até logo!');
    
    sessionStorage.removeItem('studentId');
    sessionStorage.removeItem('studentName');
    sessionStorage.removeItem('roomCode');
    
    navigate('/');
  };

  if (!studentName) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#605BEF]">
        <div className="text-white text-xl">Carregando...</div>
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
        <div className="w-full max-w-4xl">
          {/* Card Principal */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
            {/* Status */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-bold text-lg mb-4">
                <Clock size={24} className="animate-pulse" />
                Aguardando o professor...
              </div>
              
              <h1 className="text-3xl font-bold text-[#605BEF] mb-2">
                Sala de Espera
              </h1>
              <p className="text-gray-600">
                Olá, <strong>{studentName}</strong>! Aguarde o início do quiz.
              </p>
            </div>

            {/* Info do Quiz */}
            {quiz && (
              <div className="bg-gradient-to-br from-[#605BEF] to-[#7B73E8] rounded-2xl p-6 text-white mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen size={28} />
                  <h2 className="text-2xl font-bold">
                    {quiz.config.titulo}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <p className="text-white/80 text-sm mb-1">Nível</p>
                    <p className="text-xl font-bold">{quiz.config.nivel}</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <p className="text-white/80 text-sm mb-1">Total de Questões</p>
                    <p className="text-xl font-bold">{quiz.questoes.length}</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <p className="text-white/80 text-sm mb-1">Tempo por Questão</p>
                    <p className="text-xl font-bold">{quiz.config.tempoPorQuestao}s</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de participantes */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users size={24} className="text-[#605BEF]" />
                <h3 className="text-xl font-bold text-[#605BEF]">
                  Participantes ({totalStudents})
                </h3>
              </div>
              
              {students.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <p>Carregando lista de alunos...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {students.map((student, index) => (
                    <div 
                      key={student.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        student.id === studentId 
                          ? 'bg-[#605BEF] text-white' 
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        student.id === studentId 
                          ? 'bg-white text-[#605BEF]' 
                          : 'bg-[#605BEF] text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          student.id === studentId ? 'text-white' : 'text-gray-800'
                        }`}>
                          {student.name}
                          {student.id === studentId && ' (Você)'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-white/90 rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-bold text-[#605BEF] mb-3">
              📋 Instruções
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#605BEF] font-bold">1.</span>
                <span>Aguarde o professor iniciar o quiz.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#605BEF] font-bold">2.</span>
                <span>Mantenha esta janela aberta.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#605BEF] font-bold">3.</span>
                <span>Quando o quiz começar, você será redirecionado automaticamente.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#605BEF] font-bold">4.</span>
                <span>Responda todas as questões dentro do tempo limite.</span>
              </li>
            </ul>
          </div>

          {/* Botão de sair */}
          <div className="text-center">
            <button
              onClick={() => setLeaveModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-flex items-center gap-2"
            >
              <LogOut size={20} />
              Sair da Sala
            </button>
          </div>
        </div>
      </main>

      {/* Modal de confirmação para sair */}
      <ConfirmModal
        isOpen={leaveModal}
        onClose={() => setLeaveModal(false)}
        onConfirm={handleLeaveRoom}
        title="Sair da Sala"
        description="Tem certeza que deseja sair da sala de espera? Você precisará entrar novamente com o código."
        confirmText="Sair"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
