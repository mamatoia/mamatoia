import { getApiUrl } from "../config";
// `#app` is provided by Nuxt at runtime — silence TypeScript where types aren't available
// @ts-ignore
import { useCookie } from "#app";

export interface LoginResponse {
  error: boolean;
  message: string;
  token?: string;
  [key: string]: any;
}

export const fetchLogin = async (username: string, password: string) => {
  let data: LoginResponse = { error: true, message: "Token not found" };

  try {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    data = await $fetch(`${getApiUrl()}/usuarios/authenticate/`, {
      method: "POST",
      body: params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // Esto permite que $fetch no lance excepción en errores HTTP
      retry: 0,
      onResponseError({ response }) {
        console.error("Error fetching token:", response);
        // Puedes personalizar el mensaje aquí si el backend lo envía en el body
        data = {
          error: true,
          message: response._data?.message || `Error ${response.status}`,
        };
      },
    });

    if (!data.error && data.token) {
      // Guardar el token en cookie para SSR y middleware
      const tokenCookie = useCookie("token");
      tokenCookie.value = data.token;
    }
    // Token obtenido exitosamente
    return data;
  } catch (error: any) {
    console.error("Error fetching Paseshow user:", error);
    const errorMessage =
      error?.data?.message || error?.message || "Unknown error";
    return { error: true, message: errorMessage };
  }
};
