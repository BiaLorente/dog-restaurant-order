export interface IProdutoClient {
  getPrice(productId: string): Promise<number>;
}
