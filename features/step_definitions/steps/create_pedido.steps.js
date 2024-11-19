const { Given, When, Then } = require('cucumber');
const {MockPedidoRepository} = require('../../mocks/mock-pedido-repository.ts');
const {PedidoUseCase} = require('../../../src/domain/use-cases/pedido-use-case.service.ts');
const assert = require('assert');

let service;
let result;
let customerId;
let combos;

Given('I have valid customer ID {string} and combos', function (id) {
  customerId = id;
  combos = [];
  const mockPedidoRepository = new MockPedidoRepository();
  service = new PedidoUseCase(mockPedidoRepository);
}); 

When('I create an order', async function () {
  result = await service.createPedido(customerId, combos);
});

Then('I should receive the order ID', function () {
  assert.strictEqual(typeof result, 'string', 'Expected result to be a string');
});
