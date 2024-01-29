import * as express from "express";
import { PaymentController } from "../controllers/payment.controller";
import { BraintreeGateway, Environment } from "braintree";
import { braintreeInfo } from "../config";
import { BraintreeService } from "../services/braintreeService";

const app = express();

const braintreeGateway = new BraintreeGateway({
    environment: Environment.Sandbox,
    merchantId: braintreeInfo.merchantId,
    publicKey: braintreeInfo.publicKey,
    privateKey: braintreeInfo.privateKey
});

const braintreeService = new BraintreeService(braintreeGateway);
const paymentController = new PaymentController(braintreeService);

app.post('/payment/confirm', (req, res) => paymentController.confirmPayment(req, res));

app.post('/payment/token', (req, res) => paymentController.generateToken(req, res));

export {  app, braintreeGateway };