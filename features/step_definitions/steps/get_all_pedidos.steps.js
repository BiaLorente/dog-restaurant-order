const { Given, When, Then } = require('cucumber');
const { MockPedidoRepository } = require('../../mocks/mock-pedido-repository.ts');
const { PedidoUseCase } = require('../../../src/domain/use-cases/pedido-use-case.service.ts');
const assert = require('assert');

let service;
let orders;
let error;

Given('there are orders in the system', function () {
  const mockPedidoRepository = new MockPedidoRepository();
  service = new PedidoUseCase(mockPedidoRepository);
});

When('I request all orders', async function () {
  try {
    orders = await service.getAllPedidos();
  } catch (err) {
    error = err;
  }
});

Then('I should receive a list of orders', function () {
  assert(Array.isArray(orders), 'Expected orders to be an array');
  assert(orders.length > 0, 'Expected orders to not be empty');
});

Then('the orders should be filtered and sorted', function () {
  const statuses = orders.map(order => order.status);
  const sortedStatuses = [...statuses].sort((a, b) => {
    const priority = {
      WAITING_DELIVERY: 1,
      PREPARING: 2,
      CONFIRMED: 3,
    };
    return priority[a] - priority[b];
  });
  assert.deepStrictEqual(statuses, sortedStatuses, 'Orders should be sorted by status');
});
