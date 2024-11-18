/* eslint-disable @typescript-eslint/no-unused-vars */
import { Given, When, Then } from '@cucumber/cucumber';
import { PedidoUseCase } from './../../../src/domain/use-cases/pedido-use-case.service';
import { MockPedidoRepository } from '../../mocks/mock-pedido-repository';
import { expect } from 'chai';

let service: PedidoUseCase;
let result: any;
let error: any;

Given('there is an order with ID {string}', function (orderId: string) {
  const mockPedidoRepository = new MockPedidoRepository();
  service = new PedidoUseCase(mockPedidoRepository);
});

When('I request the order by ID {string}', async function (orderId: string) {
  try {
    result = await service.getPedidoById(orderId);
  } catch (err) {
    error = err;
  }
});

Then('I should receive the order details', function () {
  expect(result).to.be.an('object');
  expect(result.pedidoId).to.equal('1');
});

Given('there is no order with ID {string}', function (orderId: string) {
  const mockPedidoRepository = new MockPedidoRepository();
  service = new PedidoUseCase(mockPedidoRepository);
  mockPedidoRepository.getPedidoById = jest
    .fn()
    .mockResolvedValueOnce(undefined);
});

Then(
  'I should receive an error message {string}',
  function (errorMessage: string) {
    expect(error.message).to.equal(errorMessage);
  },
);
