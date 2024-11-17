import { Donations } from './Donations';

export class Vouchers {
  idComprobante: number = 0;
  fechaEmision: Date = new Date();
  total: number = 0;
  nombreDonante: string = '';
  descripcion: string = '';
  donations: Donations = new Donations();
}
