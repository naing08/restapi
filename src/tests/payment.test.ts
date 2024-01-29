import * as request from "supertest";
import app from "../index";
import { AppDataSource } from "../data-source";
import { BraintreeGateway, Environment, Transaction, TransactionRequest, ValidatedResponse } from 'braintree';

jest.mock('braintree');

import * as uuid from "uuid";

import { braintreeInfo, payPalInfo } from "../config";

const braintreeGateway = new BraintreeGateway({
    environment: Environment.Sandbox,
    merchantId: braintreeInfo.merchantId,
    publicKey: braintreeInfo.publicKey,
    privateKey: braintreeInfo.privateKey
});


const mockTransactionSale = jest.fn();

// BraintreeGateway.prototype.transaction.sale = mockTransactionSale;
// BraintreeGateway.prototype.transaction = {
//   sale: mockTransactionSale
// };
    
// jest.spyOn(braintreeGateway['transaction'], 'sale').mockImplementation(async (request: TransactionRequest) => {
//   return {
//     success: true,
//     transaction: { id: 'mocked_transaction_id' },
//   } as ValidatedResponse<any>;
// });

class MockBraintreeGateway {
  public transaction = {
    sale: mockTransactionSale
  };

  constructor(config: any) {
    // Add any necessary setup logic for your mock BraintreeGateway instance
  }
}

jest.mock('braintree', () => {
  const actualBraintree = jest.requireActual('braintree');
  
  // Replace the constructor with the mock class constructor
  actualBraintree.BraintreeGateway = MockBraintreeGateway as any;

  return actualBraintree;
});

beforeAll(async () => {
    await AppDataSource.initialize();
});

describe("API endpoint /payment", () => {
  // GET - List all colors
  it("should return Invalid Card Type", async () => {

    const mockedTransactionId = uuid.v4();

    const options = {
      submitForSettlement: false,
      storeInVaultOnSuccess: true,
      addBillingAddressToPaymentMethod: true, 
    };

    mockTransactionSale.mockResolvedValue({
      success: true,
      transaction: { id: mockedTransactionId },
    });

    const res = await request(app)
      .post("/payment")
      .send({
        customerName:"ABC",
        currency:"EUD",
        cardType:"AMEX",
        amount:1000,
        nonce: 'mocked_payment_method_nonce',
        options
      })
      expect(res.status).toEqual(500);
      expect(res.body.errorMessage).toEqual("Invalid Card Type!");
  });

  it("should return Transaction", async () => {

    const mockedTransactionId = uuid.v4();

    const options = {
      submitForSettlement: false,
      storeInVaultOnSuccess: true,
      addBillingAddressToPaymentMethod: true, 
    };

    mockTransactionSale.mockResolvedValue({
      success: true,
      transaction: { id: mockedTransactionId },
    });

    const res = await request(app)
      .post("/payment/confirm")
      .send({
        customerName:"ABC",
        currency:"EUD",
        cardType:"AMEX",
        amount:1000,
        nonce: 'mocked_payment_method_nonce',
        options
      })
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        transactionId: mockedTransactionId
      });
  });

});