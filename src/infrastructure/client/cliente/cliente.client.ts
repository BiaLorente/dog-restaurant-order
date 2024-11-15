import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { IClienteClient } from 'src/domain/client/cliente-client.interface';

@Injectable()
export class ClienteClient implements IClienteClient {
  constructor(private readonly httpService: HttpService) {}
  async getName(clientId: string): Promise<string> {
    const url = `name?clientId=${clientId}`;

    const { data } = await firstValueFrom(
      this.httpService.get<string>(url).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      ),
    );

    return data;
  }
}
