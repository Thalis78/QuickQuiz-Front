import { API_URL } from "@/utils/apiUtils";

const BASE_URL = `${API_URL}`;

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
