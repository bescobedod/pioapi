import { inject, injectable } from "tsyringe";
import { JsonResponse, RequestAuth } from "../../types/ResponseTypes";
import { handleSend } from "../../utils/HandlerFactory";
import { Response } from "express";
import DevolucionRepository from "../../repositories/DevolucionRepository";
import EntradaInventarioRepository from "../../repositories/EntradaInventarioRepository";
import DevolucionEstadoModel from "../../models/pioapp/tables/DevolucionEstadoModel";

@injectable()
export default class DevolucionQueryController {
  constructor(
    @inject(DevolucionRepository)
    private devolucionRepository: DevolucionRepository,
    @inject(EntradaInventarioRepository)
    private entradaInventarioRepository: EntradaInventarioRepository,
  ) {}

  async getDevolucionesByUser(
    req: RequestAuth,
    res: Response<JsonResponse<any[]>>,
  ) {
    await handleSend(
      res,
      async () => {
        const userId = req.user?.id_users;
        if (!userId) throw new Error("Usuario no encontrado en la sesión.");

        const devoluciones =
          await this.devolucionRepository.getDevolucionesByUserId(
            Number(userId),
          );

        // Enrich each devolucion with serie+numero from tEntradaInventario
        const enriched = await Promise.all(
          devoluciones.map(async (dev: any) => {
            try {
              if (dev.idEntradaInventario) {
                const entrada =
                  await this.entradaInventarioRepository.findEntradaInventario(
                    {
                      idEntradaInventario: Number(dev.idEntradaInventario),
                    } as any,
                    false,
                    true,
                  );
                return {
                  ...dev,
                  id_recepcion: entrada
                    ? `${entrada.serie}-${entrada.numero}`
                    : null,
                };
              }
              return { ...dev, id_recepcion: null };
            } catch {
              return { ...dev, id_recepcion: null };
            }
          }),
        );

        return enriched;
      },
      "Historial de devoluciones consultado exitosamente.",
    );
  }

  async getDevolucionDetalleById(
    req: RequestAuth,
    res: Response<JsonResponse<any>>,
  ) {
    await handleSend(
      res,
      async () => {
        const { id } = req.params;
        if (!id) throw new Error("ID de devolución no proporcionado.");

        // Get encabezado
        const encabezado = await this.devolucionRepository.getDevolucionById(
          Number(id),
        );
        if (!encabezado) throw new Error("Devolución no encontrada.");

        // Get tEntradaInventario info
        let entradaInventario = null;
        if (encabezado.idEntradaInventario) {
          entradaInventario =
            await this.entradaInventarioRepository.findEntradaInventario(
              {
                idEntradaInventario: Number(encabezado.idEntradaInventario),
              } as any,
              false,
              true,
            );
        }

        // Get productos
        const productos = await this.devolucionRepository.getDevolucionDetalle(
          Number(id),
        );

        // Get estado name
        let estadoName = null;
        if (encabezado.id_devolucion_estado) {
          const estadoRecord = await DevolucionEstadoModel.findOne({
            where: { id_devolucion_estado: encabezado.id_devolucion_estado },
            raw: true,
          });
          estadoName = estadoRecord?.name || null;
        }

        return {
          encabezado: {
            ...encabezado,
            estado: estadoName,
            id_recepcion: entradaInventario
              ? `${entradaInventario.serie}-${entradaInventario.numero}`
              : null,
            entrada_inventario: entradaInventario,
          },
          productos,
        };
      },
      "Detalle de devolución consultado exitosamente.",
    );
  }
}
