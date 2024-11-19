import { Pedido } from './../../src/domain/entities/pedido.entity';
import { PedidoStatus } from './../../src/domain/enum/order-status.enum';
import { IPedidoRepository } from './../../src/domain/repositories/order-repository.interface';

export class MockPedidoRepository implements IPedidoRepository {
  private pedidos: Pedido[] = [
    Pedido.buildOrder(
      '1',
      'short1',
      new Date(),
      new Date(),
      new Date(),
      PedidoStatus.CONFIRMED,
      100,
      'customer1',
    ),
    Pedido.buildOrder(
      '2',
      'short2',
      new Date(),
      new Date(),
      new Date(),
      PedidoStatus.PREPARING,
      200,
      'customer2',
    ),
  ];

  async getAllPedidos(): Promise<Pedido[]> {
    return this.pedidos;
  }

  async getPedidoById(orderId: string): Promise<Pedido | null> {
    return this.pedidos.find((pedido) => pedido.pedidoId === orderId) || null;
  }

  async getPedidosByStatus(status: PedidoStatus): Promise<Pedido[]> {
    return this.pedidos.filter((pedido) => pedido.status === status);
  }

  async updatePedido(pedido: Pedido): Promise<void> {
    const index = this.pedidos.findIndex((p) => p.pedidoId === pedido.pedidoId);
    if (index !== -1) {
      this.pedidos[index] = pedido;
    }
  }

  async createPedido(pedido: Pedido): Promise<string> {
    this.pedidos.push(pedido);
    return pedido.pedidoId;
  }
}

