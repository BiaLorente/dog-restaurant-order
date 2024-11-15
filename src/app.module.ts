import { Module } from '@nestjs/common';
import { PedidoModule } from './application/pedido.module';

@Module({
  imports: [PedidoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
