import { AppDataSource } from "./data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
// import { paymentRouter } from "./routes/payment.routes";
import "reflect-metadata";
import { errorHandler } from "./middlewares/errors";
import * as paypal from "paypal-rest-sdk";
import { payPalInfo, braintreeInfo } from "./config";
import { BraintreeService } from "./services/braintreeService";
import { braintreeGateway, app as paymentRouter } from "./routes/payment.routes";
import * as braintree from "braintree";
import * as cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(errorHandler);
const { PORT = 3030 } = process.env;
// app.use("/payment", paymentRouter);

paypal.configure({
  mode: 'sandbox',
  client_id: payPalInfo.clientId,
  client_secret: payPalInfo.secretKey
});

app.use(cors());
app.use("/", paymentRouter);

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});


export default app;

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));

