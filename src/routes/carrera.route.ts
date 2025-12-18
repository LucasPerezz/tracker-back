import { Router } from "express";
import prisma from "../prisma/prismaClient";

const carreraRouter = Router();

carreraRouter.get("/", async (_req, res) => {
  try {
    const carreras = await prisma.carrera.findMany();
    return res.status(200).json({
      success: true,
      data: carreras,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "InternalServerError",
      msg: "Ha ocurrido un error inesperado, intentelo mas tarde",
    });
  }
});

carreraRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const carrera = await prisma.carrera.findUnique({
      where: {
        id: +id,
      },
    });

    if (!carrera) {
      return res.status(404).json({
        success: false,
        error: "NotFoundError",
        msg: "Carrera no encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: carrera,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "InternalServerError",
      msg: "Ha ocurrido un error inesperado, intentelo mas tarde",
    });
  }
});

carreraRouter.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;

    const carrera = await prisma.carrera.create({
      data: {
        nombre,
      },
    });

    return res.status(201).json({
      success: true,
      code: 201,
      msg: "Carrera creada exitosamente",
      data: carrera,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "InternalServerError",
      msg: "Ha ocurrido un error inesperado, intentelo mas tarde",
    });
  }
});

carreraRouter.post(
  "/agregar_materia/:carreraId/:materiaId",
  async (req, res) => {
    try {
      const { carreraId, materiaId } = req.params;

      const mat = await prisma.materia.findUnique({
        where: {
          id: +materiaId,
        },
      });

      if (!mat) {
        return res.status(404).json({
          success: false,
          error: "NotFoundError",
          msg: "Materia no encontrada",
        });
      }

      const carrera = await prisma.carrera.findUnique({
        where: {
          id: +carreraId,
        },
      });

      if (!carrera) {
        return res.status(404).json({
          success: false,
          error: "NotFoundError",
          msg: "Carrera no encontrada",
        });
      }

      const materiaActualizada = await prisma.materia.update({
        where: {
          id: +materiaId,
        },
        data: {
          carrera: {
            connect: {
              id: +carreraId,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        msg: "Materia agregada con exito",
        data: materiaActualizada,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "InternalServerError",
        msg: "Ha ocurrido un error inesperado, intentelo mas tarde",
      });
    }
  }
);


carreraRouter.post("/asignar_carrera/:usuarioId/:carreraId", async (req, res) => {
  try {
    const { usuarioId, carreraId } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: +usuarioId
      }
    });

    if(!usuario) return res.status(404).json({
      success: false,
      error: "NotFoundError",
      msg: "Usuario no encontrado"
    });

    const carrera = await prisma.carrera.findUnique({
      where: {
        id: +carreraId
      }
    });

    if(!carrera) return res.status(404).json({
      success: false,
      error: "NotFoundError",
      msg: "Carrera no encontrada"
    });

    const usuarioActualizado = await prisma.usuario.update({
      where: {
        id: +carreraId
      },
      data: {
        carreraId: +carreraId
      }
    });

    return res.status(200).json({
      success: true,
      data: usuarioActualizado
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "InternalServerError",
      msg: "Ha ocurrido un error inesperado, intentelo mas tarde",
    });
  }
})


export default carreraRouter;
