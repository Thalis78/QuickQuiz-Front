import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Quiz } from './QuizContext';

export interface Student {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface Room {
  id: string;
  code: string;
  quiz: Quiz;
  students: Student[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
  startedAt?: Date;
}

interface RoomContextType {
  currentRoom: Room | null;
  createRoom: (quiz: Quiz) => string;
  addStudent: (studentName: string) => void;
  removeStudent: (studentId: string) => void;
  startQuiz: () => void;
  endQuiz: () => void;
  getRoomByCode: (code: string) => Room | null;
  closeRoom: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within RoomProvider');
  }
  return context;
};

interface RoomProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'ciel_active_room';

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const room = JSON.parse(stored);
      // Converte strings de data de volta para Date
      room.createdAt = new Date(room.createdAt);
      if (room.startedAt) room.startedAt = new Date(room.startedAt);
      room.students = room.students.map((s: any) => ({
        ...s,
        joinedAt: new Date(s.joinedAt)
      }));
      return room;
    }
    return null;
  });

  const generateRoomCode = (): string => {
    // Gera código de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const createRoom = (quiz: Quiz): string => {
    const code = generateRoomCode();
    const newRoom: Room = {
      id: `room_${Date.now()}`,
      code,
      quiz,
      students: [],
      status: 'waiting',
      createdAt: new Date(),
    };

    setCurrentRoom(newRoom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRoom));
    return code;
  };

  const addStudent = (studentName: string) => {
    if (!currentRoom) return;

    const newStudent: Student = {
      id: `student_${Date.now()}`,
      name: studentName.trim(),
      joinedAt: new Date(),
    };

    const updatedRoom = {
      ...currentRoom,
      students: [...currentRoom.students, newStudent],
    };

    setCurrentRoom(updatedRoom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoom));
  };

  const removeStudent = (studentId: string) => {
    if (!currentRoom) return;

    const updatedRoom = {
      ...currentRoom,
      students: currentRoom.students.filter(s => s.id !== studentId),
    };

    setCurrentRoom(updatedRoom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoom));
  };

  const startQuiz = () => {
    if (!currentRoom) return;

    const updatedRoom = {
      ...currentRoom,
      status: 'playing' as const,
      startedAt: new Date(),
    };

    setCurrentRoom(updatedRoom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoom));
  };

  const endQuiz = () => {
    if (!currentRoom) return;

    const updatedRoom = {
      ...currentRoom,
      status: 'finished' as const,
    };

    setCurrentRoom(updatedRoom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoom));
  };

  const getRoomByCode = (code: string): Room | null => {
    if (currentRoom && currentRoom.code === code) {
      return currentRoom;
    }
    return null;
  };

  const closeRoom = () => {
    setCurrentRoom(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <RoomContext.Provider
      value={{
        currentRoom,
        createRoom,
        addStudent,
        removeStudent,
        startQuiz,
        endQuiz,
        getRoomByCode,
        closeRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
