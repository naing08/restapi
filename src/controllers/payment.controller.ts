
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import * as cache from "memory-cache";
import * as braintree from "braintree";
import * as paypal from "paypal-rest-sdk";
import { Order } from "../entity/order";
// import { braintreeInfo, payPalInfo } from "../config";
import { Status } from "../entity/enums";
// import { braintreeGateway } from "../utli";

import { BraintreeGateway, Environment, TransactionRequest, ValidatedResponse } from 'braintree';

import { braintreeInfo, payPalInfo } from "../config";
import { BraintreeService } from "../services/braintreeService";

// const braintreeGateway = new BraintreeGateway({
//     environment: Environment.Sandbox,
//     merchantId: braintreeInfo.merchantId,
//     publicKey: braintreeInfo.publicKey,
//     privateKey: braintreeInfo.privateKey
// });

export class PaymentController {
  private braintreeService: BraintreeService;

  constructor(braintreeService: BraintreeService) {
    this.braintreeService = braintreeService;
  }

  public async generateToken(req: Request, res: Response) {
    const response = await this.braintreeService.generateToken();
    const token = { clientToken: response.clientToken };
    res.send(token);
  }

  public async confirmPayment(req: Request, res: Response) {
    const {  customerName, currency, cardType, nonce, amount } = req.body;

    try {

        const order = new Order();
        order.customerName = customerName;
        order.currency = currency;
        order.totalAmount = amount;
        order.status = Status.PENDING;
        
        const orderRepository = AppDataSource.getRepository(Order);

        await orderRepository.insert(order);

        if (cardType == 'AMEX' && currency != 'USD'){
          res.status(500).json({ success: false, errorMessage: 'Invalid Card Type!' });
        }
        
        if (cardType == 'AMEX' || (currency == 'USD' || currency == 'EUR' || currency == 'AUD')){
          
          const result = await this.braintreeService.createTransaction({
            amount: amount,
            paymentMethodNonce: nonce,
            options: {
              submitForSettlement: false,
              storeInVaultOnSuccess: true,
              addBillingAddressToPaymentMethod: true, 
            }
          });
      
          if (result.success) {
            res.status(200).json({ success: true, transactionId: result.transaction.id });
          } else {
            res.status(500).json({ success: false, errorMessage: result.message });
          }

        } else {
          const createPaymentJson = {
            intent: 'sale',
            payer: {
              payment_method: 'paypal'
            },
            transactions: [{
              amount: {
                total: amount,
                currency
              }
            }],
            redirect_urls: {
              return_url:'http://localhost:3000/success',
              cancel_url:'http://localhost:3000/cancel'
            }
          };
          
          paypal.payment.create(createPaymentJson, function (error, payment) {
            if (error) {
              throw error;
            } else {
              res.status(200).json({ success: true, transactionId: payment.id });
            }
          });
        }
      }
      catch (error) {
        res.status(500).json({ success: false, errorMessage: 'Internal server error' });
      }
  }
}