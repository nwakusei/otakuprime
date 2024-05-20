import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Porta do servidor a ser escutada
const port = process.env.SERVER_PORT;

// Invocação do express
const app = express();

// Configuração de pasta statica (Importante para renderizar as imagens no Frontend)
app.use(express.static("public"));

// Configuração CORS
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

// // Configuração JSON response > para transformar o corpo da solicitação em JSON
// app.use(express.json());

// Middleware personalizado para analisar o corpo da solicitação com base no Content-Type
app.use((req, res, next) => {
	const contentType = req.headers["content-type"];
	if (contentType === "multipart/form-data") {
		// Para multipart/form-data, use o multer
		express.json()(req, res, next);
	} else if (contentType === "application/json") {
		// Aumente o limite de tamanho máximo do corpo da solicitação para 10MB e use express.json()
		express.json()(req, res, next);
	} else {
		// Se não for nenhum dos tipos anteriores, continue com o processamento usual
		next();
	}
});

// Importação das Rotas (não funcionais)
import CustomerRoutes from "./routes/CustomerRoutes.js";
import PartnerRoutes from "./routes/PartnerRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import OtakupayRoutes from "./routes/OtakupayRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
import InterApiRoutes from "./routes/InterApiRoutes.js";
import OtakuPrimeRoutes from "./routes/OtakuPrimeRoutes.js";
import CouponRoutes from "./routes/CouponRoutes.js";
import ReviewRoutes from "./routes/ReviewRoutes.js";
import TrackingRoutes from "./routes/TrackingRoutes.js";

// Definição das rotas
app.use("/customers", CustomerRoutes);
app.use("/partners", PartnerRoutes);
app.use("/products", ProductRoutes);
app.use("/otakupay", OtakupayRoutes);
app.use("/orders", OrderRoutes);
app.use("/interapi", InterApiRoutes);
app.use("/otakuprime", OtakuPrimeRoutes);
app.use("/coupons", CouponRoutes);
app.use("/reviews", ReviewRoutes);
app.use("/tracking", TrackingRoutes);

// Configuração do Listen
app.listen(port, () => {
	console.log(`Servidor rodando na porta: ${port}`);
});
