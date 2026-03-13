import { connectDB } from "../config/db";
import { getStockSignals } from "../controllers/stockController";

export default async function handler(req: any, res: any) {
  await connectDB();
  if (req.method === "GET") {
    await getStockSignals(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}