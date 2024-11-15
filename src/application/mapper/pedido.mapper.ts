/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ComboInput } from '../dtos/input/create-pedido.input';
import { Inject, Injectable } from '@nestjs/common';
import {
  ComboItemOutput,
  GetComboOutput,
  GetPedidoOutput,
} from '../dtos/output/get-pedido.output';
import { Pedido } from 'src/domain/entities/pedido.entity';
import { ProductType } from 'src/domain/enum/product-types.enum';
import { Combo } from 'src/domain/entities/combo.entity';
import { IProdutoClient } from 'src/domain/client/produto-client.interface';

@Injectable()
export class OrderMapper {
  constructor(
    @Inject('IProdutoClient')
    private readonly produtoClient: IProdutoClient,
  ) {}

  async mapToCombo(createComboInput: ComboInput): Promise<Combo> {
    const combo = new Combo();
    combo.addItem(
      ProductType.Lanche,
      createComboInput.lancheId,
      await this.getProductPrice(createComboInput.lancheId),
    );
    combo.addItem(
      ProductType.Bebida,
      createComboInput.bebidaId,
      await this.getProductPrice(createComboInput.bebidaId),
    );
    combo.addItem(
      ProductType.Sobremesa,
      createComboInput.sobremesaId,
      await this.getProductPrice(createComboInput.sobremesaId),
    );
    combo.addItem(
      ProductType.Acompanhamento,
      createComboInput.acompanhamentoId,
      await this.getProductPrice(createComboInput.acompanhamentoId),
    );
    return combo;
  }

  async mapToComboList(comboInputList: ComboInput[]): Promise<Combo[]> {
    const comboPromises = comboInputList.map(async (c) => {
      return this.mapToCombo(c);
    });

    return await Promise.all(comboPromises);
  }

  async getProductPrice(produtoId?: string): Promise<number> {
    let productPrice = 0;
    if (produtoId === undefined) return productPrice;
    productPrice = await this.produtoClient.getPrice(produtoId);
    return productPrice;
  }

  mapToOrderDto(order: Pedido): GetPedidoOutput {
    const combosDto: GetComboOutput[] = order.combos.map((combo) => {
      const itemsDto: ComboItemOutput[] = [];

      if (combo.lanche) {
        itemsDto.push({
          produtoId: combo.lanche.produtoId,
          categoria: 'Lanche',
          preco: combo.lanche.preco,
        });
      }
      if (combo.sobremesa) {
        itemsDto.push({
          produtoId: combo.sobremesa.produtoId,
          categoria: 'Sobremesa',
          preco: combo.sobremesa.preco,
        });
      }
      if (combo.bebida) {
        itemsDto.push({
          produtoId: combo.bebida.produtoId,
          categoria: 'Bebida',
          preco: combo.bebida.preco,
        });
      }
      if (combo.acompanhamento) {
        itemsDto.push({
          produtoId: combo.acompanhamento.produtoId,
          categoria: 'Acompanhamento',
          preco: combo.acompanhamento.preco,
        });
      }

      return {
        comboId: combo.comboId,
        items: itemsDto,
        comboValor: combo.comboAmount,
      };
    });

    const getOrderOutput = new GetPedidoOutput();
    (getOrderOutput.pedidoId = order.pedidoId),
      (getOrderOutput.clienteId = order.clienteId),
      (getOrderOutput.clienteNome = order.clienteNome),
      (getOrderOutput.criado = order.criado),
      (getOrderOutput.status = order.status),
      (getOrderOutput.combos = combosDto),
      (getOrderOutput.totalValor = order.calculateOrderTotalAmount()),
      (getOrderOutput.descontoValor = order.descontoValor);
    return getOrderOutput;
  }
}
