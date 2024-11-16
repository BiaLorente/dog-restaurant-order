import { Module } from '@nestjs/common';
import { OrderController } from './controller/pedido.controller';
import { IPedidoRepository } from 'src/domain/repositories/order-repository.interface';
import { IPedidoUseCase } from 'src/domain/use-cases/pedido-use-case.interface';
import { PedidoUseCase } from 'src/domain/use-cases/pedido-use-case.service';
import { databaseProviders } from 'src/infrastructure/data/database.provider';
import { pedidoProviders } from 'src/infrastructure/data/repositories/pedido.provider';
import { PedidoRepository } from 'src/infrastructure/data/repositories/pedido.repository';
import { OrderMapper } from './mapper/pedido.mapper';
import { ProdutoModule } from 'src/infrastructure/client/produto/produto.module';
import { ClienteModule } from 'src/infrastructure/client/cliente/cliente.module';

@Module({
  imports: [ProdutoModule],
  controllers: [OrderController],
  providers: [
    OrderMapper,
    ...pedidoProviders,
    ...databaseProviders,
    PedidoUseCase,
    {
      provide: IPedidoUseCase,
      useClass: PedidoUseCase,
    },
    PedidoRepository,
    {
      provide: IPedidoRepository,
      useClass: PedidoRepository,
    },
    {
      provide: 'IClienteClient',
      useClass: ClienteModule,
    },
  ],
})
export class PedidoModule {}
