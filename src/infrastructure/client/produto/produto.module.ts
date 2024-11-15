import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProdutoClient } from './produto.client';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('TIMEOUT'),
        maxRedirects: configService.get('MAX_REDIRECTS'),
        baseURL: configService.get('PRODUCTO_CLIENT'),
        headers: {
          'X-Requester-Token': configService.get('REQUESTER_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'IProdutoClient',
      useClass: ProdutoClient,
    },
  ],
  exports: ['IProdutoClient'],
})
export class ProdutoModule {}
