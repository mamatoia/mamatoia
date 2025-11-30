import { getApiUrl, getApiServicesUrl } from "./config";

const getAllEvents = async () => {
  /*
        @GET("https://services.paseshow.com.ar/ms-evento/eventoes/list")
    Call<JsonArray> listarEventos();
    */

  try {
    // const data = await import("~/assets/data/events.json");

    const tokenCookie = useCookie("token");
    const headers: Record<string, string> = {};

    // Solo agregar Authorization si el token existe y no está vacío
    if (tokenCookie.value && String(tokenCookie.value).trim()) {
      headers.Authorization = `Bearer ${tokenCookie.value}`;
    }

    // return import("~/assets/data/events.json").then((module) => module.default);

    const base = getApiServicesUrl();
    const data = await $fetch(`${base}/eventoes/list`, {
      method: "GET",
      headers,
    });

    // Eventos obtenidos de la API
    return data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return [];
  }
};

const getEvent = async (eventId: string, find: string = "ByEventoId") => {
  try {
    const tokenCookie = useCookie("token");
    const headers: Record<string, string> = {};

    // Solo agregar Authorization si el token existe y no está vacío
    if (tokenCookie.value && String(tokenCookie.value).trim()) {
      headers.Authorization = `Bearer ${tokenCookie.value}`;
    }

    // Asegurarse de que eventoId es string y no undefined
    const eventoIdParam = String(eventId);
    const url = `${getApiUrl()}/sectoreventoes/clean?find=${encodeURIComponent(
      find
    )}&eventoId=${encodeURIComponent(eventoIdParam)}`;
    const response = await $fetch<any[]>(url, {
      method: "GET",
      headers,
    });
    return response;
  } catch (error: any) {
    console.error("Error fetching event:", error);
    throw new Error(error?.message || "Failed to fetch event");
  }
};

export { getAllEvents, getEvent };
