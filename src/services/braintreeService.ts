import { BraintreeGateway, TransactionRequest, ValidatedResponse } from 'braintree';

export class BraintreeService {
  private gateway: BraintreeGateway;

  constructor(gateway: BraintreeGateway) {
    this.gateway = gateway;
  }

  async createTransaction(request: TransactionRequest): Promise<ValidatedResponse<any>> {
    return this.gateway.transaction.sale(request);
  }

  async generateToken(){
    const token = await this.gateway.clientToken.generate({});
    return token;
  }
}