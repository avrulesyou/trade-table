export interface Position {
    key: number
    action: string;
    profit: number;
    position_id: number;
    sl: number;
    symbol: string;
    tp: number;
    open_price: number;
    open_time: Date;
    swap: number;
    volume: number;
    close_price?: number;
    comment?: string;
  }
  