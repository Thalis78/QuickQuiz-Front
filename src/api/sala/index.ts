import { API_URL } from "@/utils/apiUtils";

const BASE_URL = `${API_URL}`;

export interface CreateRoomData {
  titulo: string;
  quantidade: number;
  tempo: number;
  nivel: string;
}

const handleError = async (res: Response, fallbackMsg: string) => {
  let message = fallbackMsg;
  let errorData: any = null;

  try {
    errorData = await res.json();
    message = errorData.error || errorData.message || fallbackMsg;
  } catch (e) {
    const textData = await res.text();
    if (textData) message = textData;
  }

  const error = new Error(message) as any;
  error.status = res.status;
  error.data = errorData;
  throw error;
};

export const login = async (email: string, password: string): Promise<any> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) await handleError(res, "Falha na autenticação.");

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("@App:token", data.token);
  }

  return data;
};

export const createRoom = async (roomData: CreateRoomData): Promise<any> => {
  const token = localStorage.getItem("@App:token");

  const res = await fetch(`${BASE_URL}/sala/criar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roomData),
  });

  if (!res.ok) await handleError(res, "Erro ao tentar criar a sala.");

  return await res.json();
};

export const getRoom = async (codigo: string): Promise<any> => {
  const token = localStorage.getItem("@App:token");

  const res = await fetch(`${BASE_URL}/sala/${codigo}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok)
    await handleError(res, `Erro ao tentar buscar a sala ${codigo}.`);

  return await res.json();
};
