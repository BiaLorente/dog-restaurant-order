import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { IProdutoClient } from 'src/domain/client/produto-client.interface';

@Injectable()
export class ProdutoClient implements IProdutoClient {
  constructor(private readonly httpService: HttpService) {}
  async getPrice(productId: string): Promise<number> {
    const url = `preco?productId=${productId}`;

    const { data } = await firstValueFrom(
      this.httpService.get<number>(url).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      ),
    );

    return data;
  }
}
