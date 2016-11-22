import { Order } from './order.ts'

export class Orders {
  count: number;
  next: string;
  previous: string;
  results: Order[];
}