/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

process.env = Object.assign(process.env, {
  DB_HOST:'localhost',
  DB_PORT:3306,
  DB_USERNAME:'root',
  DB_PASSWORD:'admin@123',
  DB_DATABASE:'paymentGateway'
});