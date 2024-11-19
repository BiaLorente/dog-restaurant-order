const { Given, When, Then } = require('cucumber');
const { MockPedidoRepository } = require('../../mocks/mock-pedido-repository.ts');
const { PedidoUseCase } = require('../../../src/domain/use-cases/pedido-use-case.service.ts');
const assert = require('assert');

let service;
let orders;
let error;
let mockPedidoRepository;

Given('there is an order with ID {string}', function (orderId) {
  mockPedidoRepository = new MockPedidoRepository();
  
  const order = {
    pedidoId: orderId,
    combos: [],
    clienteId: 'customer1',
    status: 'CONFIRMED',
    totalValor: 100,
    criado: new Date(),
  };

  mockPedidoRepository.getPedidoById = (id) => {
    return id === orderId ? order : null;
  };

  service = new PedidoUseCase(mockPedidoRepository);
});

When('I request the order by ID {string}', async function (orderId) {
  try {
    orders = await service.getPedidoById(orderId);
  } catch (err) {
    error = err;
  }
});

Then('I should receive the order details', function () {
  assert(typeof orders === 'object', 'Expected orders to be an object');
  assert(orders.hasOwnProperty('pedidoId'), 'Expected order to have a pedidoId property');
  assert(orders.hasOwnProperty('combos'), 'Expected order to have a combos property');
  assert.strictEqual(orders.pedidoId, '1', 'Expected order to have the pedidoId "1"');
});

Then('I should receive an error message {string}', function (errorMessage) {
  assert(error, `Expected an error but received: ${orders}`);
  assert.strictEqual(error.message, errorMessage, `Expected error message: "${errorMessage}" but got: "${error.message}"`);
});

Given('there is no order with ID {string}', function (orderId) {
  mockPedidoRepository = new MockPedidoRepository();

  mockPedidoRepository.getPedidoById = (id) => {
    return id === orderId ? null : mockPedidoRepository.getPedidoById(id);
  };

  service = new PedidoUseCase(mockPedidoRepository);
});
