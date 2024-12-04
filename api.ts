import express, { Request, Response } from "express";
import serverless from "serverless-http";

const app = express();

// Middlewares
app.use(express.json());

// Ruta principal
app.post("/api", (req: Request, res: Response) => {
    const { po, cantidad, empresa, local } = req.body;

    if (
        typeof po !== "string" ||
        typeof empresa !== "string" ||
        typeof local !== "string" ||
        typeof cantidad !== "number"
    ) {
        return res.status(400).json({
            code: 0,
            msn: "Parámetros inválidos",
        });
    }

    res.status(200).json({
        code: 1,
        msn: "Registro OK",
    });
});

// Exportar como función Lambda
export const handler = serverless(app);
