import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PedidoUseCase } from './../../../src/domain/use-cases/pedido-use-case.service';
import { MockPedidoRepository } from '../../mocks/mock-pedido-repository';
import { Combo } from '../../../src/domain/entities/combo.entity';

let service: PedidoUseCase;
let result: any;
let customerId: string;
let combos: Combo[];

Given('I have valid customer ID {string} and combos', function (id: string) {
  customerId = id;
  combos = [];
  const mockPedidoRepository = new MockPedidoRepository();
  service = new PedidoUseCase(mockPedidoRepository);
});
When('I create an order', async function () {
  result = await service.createPedido(customerId, combos);
});
Then('I should receive the order ID', function () {
  expect(result).to.be.a('string');
});
