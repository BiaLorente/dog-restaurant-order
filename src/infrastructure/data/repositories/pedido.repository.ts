import { Inject, Injectable } from '@nestjs/common';
import { Pedido } from 'src/domain/entities/pedido.entity';
import { PedidoStatus } from 'src/domain/enum/order-status.enum';
import { IPedidoRepository } from 'src/domain/repositories/order-repository.interface';
import { Repository } from 'typeorm';
import { Pedidoscombos } from '../entities/pedido-combos.entity';
import { Pedidos } from '../entities/pedido.entity';
import { OrderEntityMapper } from '../mappers/pedido-entity.mapper';
import { IClienteClient } from 'src/domain/client/cliente-client.interface';
@Injectable()
export class PedidoRepository implements IPedidoRepository {
  constructor(
    @Inject('PEDIDO_REPOSITORY')
    private orderRepo: Repository<Pedidos>,
    @Inject('COMBOS_REPOSITORY')
    private combosRepo: Repository<Pedidoscombos>,
    @Inject('IClienteClient')
    private readonly clienteClient: IClienteClient,
  ) {}

  async getAllPedidos(): Promise<Pedido[]> {
    const ordersReturn: Pedido[] = [];
    const ordersEntities = await this.orderRepo
      .createQueryBuilder('Pedidos')
      .getMany();

    for (const orderEntity of ordersEntities) {
      const combosEntities = await this.combosRepo
        .createQueryBuilder('PedidosCombos')
        .where('PedidosCombos.PedidoId = :id', { id: orderEntity.PedidoId })
        .getMany();

      const clienteName = await this.clienteClient.getName(
        orderEntity.ClienteId,
      );

      const order = OrderEntityMapper.mapToOrderDomain(
        orderEntity,
        clienteName,
      );
      const orderCombos =
        OrderEntityMapper.mapToOrderComboDomain(combosEntities);
      order.addComboList(orderCombos);

      ordersReturn.push(order);
    }
    return ordersReturn;
  }

  async getPedidoById(pedidoId: string): Promise<Pedido> {
    try {
      const [orderEntity, combosEntities] = await Promise.all([
        this.orderRepo
          .createQueryBuilder('Pedidos')
          .where('Pedidos.PedidoId = :id', { id: pedidoId })
          .getOne(),
        this.combosRepo
          .createQueryBuilder('PedidosCombos')
          .where('PedidosCombos.PedidoId = :id', { id: pedidoId })
          .getMany(),
      ]);

      if (!orderEntity) {
        throw new Error(`Pedido with ID ${pedidoId} not found.`);
      }

      const clienteName = await this.clienteClient.getName(
        orderEntity.ClienteId,
      );

      const order = OrderEntityMapper.mapToOrderDomain(
        orderEntity,
        clienteName,
      );
      const orderCombos =
        OrderEntityMapper.mapToOrderComboDomain(combosEntities);
      order.addComboList(orderCombos);

      return order;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  }

  async getPedidosByStatus(status: PedidoStatus): Promise<Pedido[]> {
    const ordersReturn: Pedido[] = [];
    const ordersEntities = await this.orderRepo
      .createQueryBuilder('Pedidos')
      .where('Pedidos.PedidoStatus = :status', { status: status })
      .getMany();

    for (const orderEntity of ordersEntities) {
      const combosEntities = await this.combosRepo
        .createQueryBuilder('PedidosCombos')
        .where('PedidosCombos.PedidoId = :id', { id: orderEntity.PedidoId })
        .getMany();

      const clienteName = await this.clienteClient.getName(
        orderEntity.ClienteId,
      );

      const order = OrderEntityMapper.mapToOrderDomain(
        orderEntity,
        clienteName,
      );
      const orderCombos =
        OrderEntityMapper.mapToOrderComboDomain(combosEntities);
      order.addComboList(orderCombos);

      ordersReturn.push(order);
    }
    return ordersReturn;
  }

  updatePedido(order: Pedido) {
    const orders = OrderEntityMapper.mapToOrderEntity(order);
    this.orderRepo.save(orders);
  }

  async createPedido(order: Pedido) {
    const orders = OrderEntityMapper.mapToOrderEntity(order);
    const combos = OrderEntityMapper.mapToOrderComboEntity(order.combos);
    await this.orderRepo.save(orders);
    await this.combosRepo.save(combos);
  }
}
