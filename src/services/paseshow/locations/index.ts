import { toTimestamp } from "../../../utils/dates";

/*
Retrofit reference:
@GET(param1 + "/ubicacioneventoes")
Call<JsonArray> consultaQR(@Query("find") String find, @Query("qr") String qr, @Query("token") String token, @Query("sectorEventoId") String sectorEventoId);

@GET(param1 + "/ubicacioneventoes")
Call<JsonArray> consultaDNI(@Query("find") String find, @Query("dni") String dni, @Query("fechaFuncion") String fechaFuncion, @Query("token") String token, @Query("sectorEventoId") String sectorEventoId);
*/

export type ConsultaQRParams = {
  find?: string; // default: ByQRCode
  qr: string;
  sectorEventoId?: string;
};

export type ConsultaDNIParams = {
  find?: string; // default: ByDniEqualsAndFechaFuncion
  dni: string;
  fechaFuncion: string | number; // timestamp
  sectorEventoId?: string;
};

export const consultaQR = async (params: ConsultaQRParams) => {
  const tokenCookie = useCookie("token");
  const find = params.find || "ByQRCode";
  const qs = new URLSearchParams();
  qs.set("find", find);
  qs.set("qr", String(params.qr));
  if (tokenCookie?.value) qs.set("token", String(tokenCookie.value));
  if (params.sectorEventoId)
    qs.set("sectorEventoId", String(params.sectorEventoId));

  const headers: Record<string, string> = {};
  // Solo agregar Authorization si el token existe y no está vacío
  if (tokenCookie.value && String(tokenCookie.value).trim()) {
    headers.Authorization = `Bearer ${tokenCookie.value}`;
  }

  const url = `/api/ubicacioneventoes?${qs.toString()}`;
  // DEBUG: mostrar URL y parámetros para verificar qué se envía desde la UI
  // Usar console.log para asegurar visibilidad en entornos donde debug está oculto
  console.log("consultaQR -> URL:", url);
  console.log("consultaQR -> Token disponible:", !!tokenCookie.value);
  console.log(
    "consultaQR -> Token (primeros 20 chars):",
    tokenCookie.value?.toString().substring(0, 20)
  );
  console.log("consultaQR -> Headers:", headers);

  return await $fetch<any[]>(url, {
    method: "GET",
    headers,
  });
};

export const consultaDNI = async (params: ConsultaDNIParams) => {
  const tokenCookie = useCookie("token");
  const find = params.find || "ByDniEqualsAndFechaFuncion";
  const qs = new URLSearchParams();
  qs.set("find", find);
  qs.set("dni", String(params.dni));
  // Spring @DateTimeFormat espera string de fecha; enviar ISO-8601
  const ts = toTimestamp(params.fechaFuncion);
  const iso = ts ? new Date(ts).toISOString() : String(params.fechaFuncion);
  qs.set("fechaFuncion", iso);
  if (tokenCookie?.value) qs.set("token", String(tokenCookie.value));
  if (params.sectorEventoId)
    qs.set("sectorEventoId", String(params.sectorEventoId));

  const headers: Record<string, string> = {};
  // Solo agregar Authorization si el token existe y no está vacío
  if (tokenCookie.value && String(tokenCookie.value).trim()) {
    headers.Authorization = `Bearer ${tokenCookie.value}`;
  }

  const url = `/api/ubicacioneventoes?${qs.toString()}`;
  // DEBUG: mostrar URL y parmetros para verificar qu se enva desde la UI
  console.log("consultaDNI -> URL:", url, {
    params: Object.fromEntries(qs.entries()),
  });
  const res = await $fetch<any>(url, {
    method: "GET",
    headers,
  });
  // DEBUG: mostrar un resumen de la respuesta para depuracin (longitud/keys)
  try {
    if (Array.isArray(res)) {
      console.log("consultaDNI -> response is array, length=", res.length);
      console.log(
        "consultaDNI -> sample item:",
        JSON.stringify(res[0]).slice(0, 1000)
      );
    } else if (res && typeof res === "object") {
      const keys = Object.keys(res || {});
      console.log("consultaDNI -> response object keys=", keys);
      if (Array.isArray((res as any).content)) {
        console.log(
          "consultaDNI -> response.content length=",
          (res as any).content.length
        );
        console.log(
          "consultaDNI -> response.content sample:",
          JSON.stringify((res as any).content[0]).slice(0, 1000)
        );
      }
      if (Array.isArray((res as any).result)) {
        console.log(
          "consultaDNI -> response.result length=",
          (res as any).result.length
        );
        console.log(
          "consultaDNI -> response.result sample:",
          JSON.stringify((res as any).result[0]).slice(0, 1000)
        );
      }
      // If response is very large, print truncated JSON of top-level keys
      if (
        !Array.isArray((res as any).content) &&
        !Array.isArray((res as any).result)
      ) {
        console.log(
          "consultaDNI -> response preview:",
          JSON.stringify(res).slice(0, 2000)
        );
      }
    }
  } catch (e) {
    console.log("consultaDNI -> error inspecting response", e);
  }
  return res;
};
