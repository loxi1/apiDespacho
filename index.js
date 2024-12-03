import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const PORT = 3000;
const bear_token = "Q29mYXF1aW5vNjU0MTIzIQ==";

const app = express();

// Middleware para habilitar CORS
app.use(cors()); // Habilita CORS para todos los dominios

// Middleware para procesar JSON
app.use(express.json());


// Middleware de autenticación Bearer
const authenticateBearer = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Verifica si el encabezado de autorización está presente
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            code: 0,
            msn: "Autenticación requerida"
        });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    // Validar el token (aquí puedes agregar lógica personalizada)
    if (token !== bear_token) {
        return res.status(403).json({
            code: 0,
            msn: "Token inválido"
        });
    }

    // Continúa con la solicitud si el token es válido
    next();
};

// Rutas protegidas
const router = express.Router();

// Ruta POST protegida con autenticación Bearer
router.post('/registro', authenticateBearer, (req, res) => {
    const { po, cantidad, empresa, local } = req.body;

    // Validar que todos los parámetros sean proporcionados
    if (!po || !cantidad || !empresa || !local) {
        return res.status(400).json({
            code: 0,
            msn: "Faltan parámetros"
        });
    }

    // Validar tipo de dato de "cantidad"
    if (typeof cantidad !== 'number') {
        return res.status(400).json({
            code: 0,
            msn: "El parámetro 'cantidad' debe ser un número"
        });
    }

    // Respuesta exitosa
    return res.status(200).json({
        code: 1,
        msn: "Registro OK"
    });
});

// Ruta pública
router.get('/', (req, res) => {
    res.json({ code: 1, msn: 'Bienvenido a la API!' });
});

// Usa el router
app.use('/despacho', router);

// Inicia el servidor localmente si no es producción
if (process.env.NODE_ENV == 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

//module.exports = app;
app.use('/.netlify/functions/server', router);
export const handler = serverless(app);
