/**
 * Servicio para manejar el registro de accesos (entradas/salidas)
 * Basado en la lógica de Android registraAcceso2
 */

export interface AccessRegistration {
  Id: number;
  dni: string;
  estado: string; // N=nuevo, E=adentro, S=afuera
  ingreso: string; // E=entrada, S=salida
  idSector: string;
  fecha: string;
  hora: string;
}

export class AccessService {
  /**
   * Registra el acceso (entrada o salida) de una persona
   */
  static async registerAccess(
    token: string,
    registrationData: AccessRegistration
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await $fetch("/api/ubicacioneventoes/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        query: { token },
        body: registrationData,
      });

      return {
        success: true,
        message:
          registrationData.ingreso === "E"
            ? "INGRESO REGISTRADO CORRECTAMENTE"
            : "SALIDA REGISTRADA CORRECTAMENTE",
      };
    } catch (error: any) {
      console.error("❌ Error en registraAcceso2:", error);

      // Manejo específico de errores
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "ERROR: Token no válido o expirado",
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          message: "ERROR: Endpoint no encontrado",
        };
      } else if (error.response?.status >= 500) {
        return {
          success: false,
          message: "ERROR: Error del servidor",
        };
      } else {
        return {
          success: false,
          message: `ERROR: ${error.response?.status || "Error de conexión"}`,
        };
      }
    }
  }

  /**
   * Convierte datos de ticket a formato de registro
   */
  static ticketToRegistration(ticketData: any): AccessRegistration {
    const now = new Date();
    const fecha = now.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const hora = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      Id: ticketData.id,
      dni: ticketData.dni,
      estado: ticketData.ingreso || "N", // Estado actual del ticket
      ingreso: "", // Se asigna en el método de registro
      idSector: ticketData.sectorEventoId?.id || "",
      fecha,
      hora,
    };
  }

  /**
   * Determina el color de fondo según el tipo de descuento
   * Basado en la lógica de Android
   */
  static getBackgroundColor(ticketData: any): string {
    try {
      const descuento = ticketData.descuentoSectorId?.descripcion || "";
      const porcentaje = ticketData.descuentoSectorId?.porcentaje || 0;

      // Si tiene descuento (porcentaje != 0) -> Amarillo
      if (porcentaje !== 0) {
        return "bg-warning text-warning-content";
      }

      // Si es "Mayores" (sin descuento) -> Verde
      if (descuento.toLowerCase().startsWith("may")) {
        return "bg-success text-success-content";
      }

      // Por defecto -> Verde
      return "bg-success text-success-content";
    } catch (error) {
      return "bg-success text-success-content";
    }
  }

  /**
   * Determina si el ticket corresponde al sector actual
   * Basado en la lógica de Android
   */
  static isValidSector(ticketData: any, currentSectorIds: string[]): boolean {
    try {
      const ticketSectorId = ticketData.sectorEventoId?.id?.toString();
      return currentSectorIds.includes(ticketSectorId);
    } catch (error) {
      return false;
    }
  }
}
