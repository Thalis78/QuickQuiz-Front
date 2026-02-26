import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Header } from '@/components/Header';
import { socketService } from '@/services/socketService';
import { toast } from '@/hooks/use-toast';

export const StudentJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const { code: urlCode } = useParams<{ code?: string }>();
  
  const [roomCode, setRoomCode] = useState(urlCode || '');
  const [studentName, setStudentName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Conecta ao Socket.IO ao montar componente
    if (!socketService.isConnected()) {
      socketService.connect().catch((error) => {
        toast({
          title: 'Erro de conexão',
          description: 'Não foi possível conectar ao servidor. Tente novamente.',
          variant: 'destructive',
        });
      });
    }
  }, []);

  const handleJoinRoom = async () => {
    // Validações
    if (!studentName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Digite seu nome para entrar na sala.',
        variant: 'destructive',
      });
      return;
    }

    if (!roomCode.trim()) {
      toast({
        title: 'Código obrigatório',
        description: 'Digite o código da sala.',
        variant: 'destructive',
      });
      return;
    }

    if (!socketService.isConnected()) {
      toast({
        title: 'Sem conexão',
        description: 'Conectando ao servidor...',
        variant: 'destructive',
      });
      try {
        await socketService.connect();
      } catch (error) {
        toast({
          title: 'Erro de conexão',
          description: 'Não foi possível conectar. Verifique sua internet.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsConnecting(true);

    socketService.joinRoom(roomCode.trim(), studentName.trim(), (response) => {
      setIsConnecting(false);

      if (response.success) {
        // Salva dados no sessionStorage
        sessionStorage.setItem('studentId', response.studentId);
        sessionStorage.setItem('studentName', studentName.trim());
        sessionStorage.setItem('roomCode', roomCode.trim());
        
        // Salva dados do quiz se vieram na resposta
        if (response.quiz) {
          sessionStorage.setItem('quizData', JSON.stringify(response.quiz));
        }
        
        // Salva total de questões
        if (response.totalQuestions) {
          sessionStorage.setItem('totalQuestions', response.totalQuestions.toString());
        }
        
        // Salva lista inicial de alunos
        if (response.students) {
          sessionStorage.setItem('studentsList', JSON.stringify(response.students));
        }

        toast({
          title: 'Conectado!',
          description: `Bem-vindo à sala, ${studentName.trim()}!`,
        });

        // Navega para sala de espera
        navigate(`/aluno/sala/${roomCode.trim()}`);
      } else {
        toast({
          title: 'Erro ao entrar',
          description: response.error || 'Não foi possível entrar na sala.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#605BEF]">
      <div className="fixed inset-0 w-full h-full z-0">
        <img src="/bg.svg" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-12">
        <div className="w-full max-w-md">
          {/* Card Principal */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#605BEF] rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#605BEF] mb-2">
                Entrar na Sala
              </h1>
              <p className="text-gray-600">
                Digite seu nome e o código da sala para participar
              </p>
            </div>

            <div className="space-y-4">
              {/* Nome do aluno */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#605BEF] focus:border-transparent text-lg"
                  maxLength={50}
                  autoFocus
                />
              </div>

              {/* Código da sala */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Código da Sala *
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyPress={handleKeyPress}
                  placeholder="000000"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#605BEF] focus:border-transparent text-center text-2xl font-bold tracking-wider"
                  maxLength={6}
                  disabled={!!urlCode}
                />
                {urlCode && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Código detectado automaticamente
                  </p>
                )}
              </div>

              {/* Botão de entrar */}
              <button
                onClick={handleJoinRoom}
                disabled={isConnecting}
                className="w-full bg-[#605BEF] hover:bg-[#4E4BC0] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-3 mt-6"
              >
                <LogIn size={24} />
                {isConnecting ? 'Entrando...' : 'Entrar na Sala'}
              </button>
            </div>

            {/* Instruções */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>Dica:</strong> Se você escaneou o QR Code, o código já está preenchido!
              </p>
            </div>
          </div>

          {/* Botão voltar */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-gray-200 font-semibold underline transition-colors"
            >
              ← Voltar para o início
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
