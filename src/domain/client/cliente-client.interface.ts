export interface IClienteClient {
  getName(clientId: string): Promise<string>;
}
