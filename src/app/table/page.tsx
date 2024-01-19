"use client"
import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import { tradeData } from '@/api/trade';
import {Table} from 'antd';

interface Position {
  [key: string]: any;
}

interface PositionsProps {
  positions: Position[];
}

const columns: { key: string; dataIndex: string, title: string }[] = [
  { key: 'position_id', dataIndex: 'position_id', title: 'Position ID' },
  { key: 'symbol', dataIndex: 'symbol', title: 'Symbol' },
  { key: 'action', dataIndex: 'action', title: 'Action' },
  { key: 'volume', dataIndex: 'volume', title: 'Lot' },
  { key: 'open_time', dataIndex: 'open_time', title: 'Open Time' },
  { key: 'open_price', dataIndex: 'open_price', title: 'Open Price' },
  { key: 'sl', dataIndex: 'sl', title: 'SL' },
  { key: 'tp', dataIndex: 'tp', title: 'TP' },
  { key: 'swap', dataIndex: 'swap', title: 'Swap' },
  { key: 'close_price', dataIndex: 'close_price', title: 'Close Price' },
  { key: 'profit', dataIndex: 'profit', title: 'Profit' },
];

const Positions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [profit, setProfit] = useState(500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await tradeData();
        data.map(dat => {
          if(dat.action == 0){
          dat.action = "buy"
        }else{
          dat.action = "sell"
        }
        })
        console.log("API Data" + data)
        setPositions(data);
          let sum:number = 0
          data.forEach(element => {
            sum = sum + element.profit;
          });
          setProfit(sum);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });

  return (
    <div className='m-3 mx-5'>
    <Table columns={columns} dataSource={positions} />
    <div className='mx-auto'>
      <p>Total Profit : {profit}</p>
    </div>
    </div>
    );
};

export default Positions;