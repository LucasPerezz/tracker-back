import { Router } from "express";
import prisma from "../prisma/prismaClient";

const carreraRouter = Router();

carreraRouter.get("/", async (_req, res) => {
  try {
    const carreras = await prisma.carrera.findMany();
    res.status(200).json({
      success: true,
      data: carreras,
    });
  } catch (error) {
    res.status(500).json({
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
      res.status(404).json({
        success: false,
        error: "NotFoundError",
        msg: "Carrera no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: carrera,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(201).json({
      success: true,
      code: 201,
      msg: "Carrera creada exitosamente",
      data: carrera,
    });
  } catch (error) {
    res.status(500).json({
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
        res.status(404).json({
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
        res.status(404).json({
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

      res.status(201).json({
        success: true,
        msg: "Materia agregada con exito",
        data: materiaActualizada,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "InternalServerError",
        msg: "Ha ocurrido un error inesperado, intentelo mas tarde",
      });
    }
  }
);

export default carreraRouter;
