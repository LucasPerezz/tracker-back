import { Router } from "express";
import prisma from "../prisma/prismaClient";
import bcrypt from "bcrypt"


const routerUsuarios = Router();

routerUsuarios.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await prisma.usuario.findUnique({
            where: { id: +id },
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                error: "NotFoundError",
                msg: "Usuario no encontrado",
            });
        }

        const { password, ...rest } = usuario;

        return res.status(200).json({
            success: true,
            data: rest,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError",
            msg: "Ha ocurrido un error inesperado, intentelo más tarde",
        });
    }
});

routerUsuarios.post("/", async (req, res) => {
    try {
        const { nombre, apellido, correo, password } = req.body;

        const passHashed = await bcrypt.hash(password, 10);

        const usuarioCreado = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                correo,
                password: passHashed
            }

        });

        return res.status(201).json({
            success: true,
            data: usuarioCreado
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError",
            msg: "Ha ocurrido un error inesperado, intentelo más tarde",
        });
    }
})

routerUsuarios.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo, password } = req.body;
        const passHashed = await bcrypt.hash(password, 10);
        const usuario = await prisma.usuario.update({
            where: {
                id: +id
            },
            data: {
                nombre,
                apellido,
                correo,
                password: passHashed
            }
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                error: "InternalServerError",
                msg: "Ha ocurrido un error inesperado, intentelo mas tarde"
            });
        }

        return res.status(200).json({
            success: true,
            data: usuario
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError",
            msg: "Ha ocurrido un error inesperado, intentelo más tarde",
        });
    }
})

routerUsuarios.get("/cont", async (req, res) => {
    try {
        const cont = await prisma.usuario.count();
        return res.status(200).json(cont);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError",
            msg: "Ha ocurrido un error inesperado, intentelo más tarde",
        });
    }

})



export default routerUsuarios;