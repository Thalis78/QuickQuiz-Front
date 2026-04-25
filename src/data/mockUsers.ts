import { Professor } from "@/types/type";

const API_URL = 'http://localhost:3001/api';

// Validar login com backend (verifica se email está autorizado)
export const validateProfessorLogin = async (email: string, password: string): Promise<Professor | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.success ? data.professor : null;
  } catch (error) {
    console.error('Erro ao validar login:', error);
    return null;
  }
};
