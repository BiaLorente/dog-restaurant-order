import { Given, When, Then } from '@cucumber/cucumber';
import { PedidoUseCase } from './../../../src/domain/use-cases/pedido-use-case.service';
import { MockPedidoRepository } from '../../mocks/mock-pedido-repository';
import { expect } from 'chai';
import { PedidoStatus } from '../../../src/domain/enum/order-status.enum';

let service: PedidoUseCase;
let result: any;

Given('there are orders in the system', function () {
  const mockPedidoRepository = new MockPedidoRepository();
  service = new PedidoUseCase(mockPedidoRepository);
});

When('I request all orders', async function () {
  result = await service.getAllPedidos();
});

Then('I should receive a list of orders', function () {
  expect(result).to.be.an('array');
  expect(result).to.have.lengthOf(2);
});

Then('the orders should be filtered and sorted', function () {
  expect(result[0].status).to.equal(PedidoStatus.PREPARING);
});
