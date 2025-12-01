/**
 * Genera la URL del escáner con parámetros limpios
 */
export const generateScannerUrl = (
  eventoId: string,
  fechaFuncion: string | number,
  sectorId: string,
  baseUrl?: string
) => {
  const params = new URLSearchParams({
    evento: eventoId,
    fecha: String(fechaFuncion),
    sector: sectorId,
  });

  const url = `/escaner?${params.toString()}`;

  if (baseUrl) {
    return `${baseUrl}${url}`;
  }

  return url;
};

/**
 * Genera la URL completa del escáner para compartir o abrir en nueva pestaña
 */
export const generateFullScannerUrl = (
  eventoId: string,
  fechaFuncion: string | number,
  sectorId: string
) => {
  if (typeof window !== "undefined") {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    return generateScannerUrl(eventoId, fechaFuncion, sectorId, baseUrl);
  }

  return generateScannerUrl(eventoId, fechaFuncion, sectorId);
};

/**
 * Abre el escáner en una nueva pestaña
 */
export const openScanner = (
  eventoId: string,
  fechaFuncion: string | number,
  sectorId: string
) => {
  const url = generateScannerUrl(eventoId, fechaFuncion, sectorId);
  window.open(url, "_blank");
};

/**
 * Navega al escáner en la misma pestaña
 */
export const navigateToScanner = (
  eventoId: string,
  fechaFuncion: string | number,
  sectorId: string,
  router: any
) => {
  const url = generateScannerUrl(eventoId, fechaFuncion, sectorId);
  router.push(url);
};

/**
 * Abre el escáner en una nueva pestaña sin parámetros específicos
 */
export const openScannerWindow = () => {
  window.open("/escaner", "_blank");
};
