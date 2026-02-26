import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Conectado ao servidor Socket.IO');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Erro de conexão:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Desconectado:', reason);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Emissores
  createRoom(quiz: any, callback: (response: any) => void) {
    this.socket?.emit('create-room', quiz, callback);
  }

  joinRoom(code: string, name: string, callback: (response: any) => void) {
    this.socket?.emit('join-room', { code, name }, callback);
  }

  leaveRoom(code: string, studentId: string) {
    this.socket?.emit('leave-room', { code, studentId });
  }

  startQuiz(code: string, callback: (response: any) => void) {
    this.socket?.emit('start-quiz', code, callback);
  }

  submitAnswer(code: string, studentId: string, questionIndex: number, answer: string, callback: (response: any) => void) {
    this.socket?.emit('submit-answer', { code, studentId, questionIndex, answer }, callback);
  }

  nextQuestion(code: string, callback: (response: any) => void) {
    this.socket?.emit('next-question', code, callback);
  }

  closeRoom(code: string) {
    this.socket?.emit('close-room', code);
  }

  // Listeners
  onStudentJoined(callback: (data: any) => void) {
    this.socket?.on('student-joined', callback);
  }

  onStudentLeft(callback: (data: any) => void) {
    this.socket?.on('student-left', callback);
  }

  onQuizStarted(callback: (data: any) => void) {
    this.socket?.on('quiz-started', callback);
  }

  onNextQuestion(callback: (data: any) => void) {
    this.socket?.on('next-question', callback);
  }

  onQuizFinished(callback: (data: any) => void) {
    this.socket?.on('quiz-finished', callback);
  }

  onRoomClosed(callback: () => void) {
    this.socket?.on('room-closed', callback);
  }

  onStudentAnswered(callback: (data: any) => void) {
    this.socket?.on('student-answered', callback);
  }

  // Remover listeners
  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();
