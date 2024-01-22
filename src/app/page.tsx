"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {Table} from 'antd';
import { Position } from '@/types/position';




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



const getServerData = async (): Promise<Position[]> => {
  console.log("Making api call")
 const response = await fetch('/api/data');
 const data = await response.json();

 // Now you can use the data
 console.log(data);
 return data;
};

const Positions: React.FC = () => {
  //console.log(props)
  const [positions, setPositions] = useState<Position[]>([]);
  const [profit, setProfit] = useState<number>(111);
  
  
  useEffect(() => {
   
        const fetchData = async () => {
          let summ:number =0;
          positions.forEach((position) => {
            summ+=position.profit;
          });
          console.log("this is calculated sum " + summ );
          setProfit(summ);
          const serverData: Position[] = await getServerData();
          console.log("Hi This is API Data " + serverData)
          let sum:number =0;
          serverData.forEach((data)=> {
            sum+=data.profit;
          });
          setPositions(serverData);
          setProfit(sum);

          const socket = io('wss://quotes.equidity.io:3000');
          socket.emit('subscribe', 'feeds');
    
          
          socket.on('message', (socketData: any) => {
            console.log("SocketData "+ JSON.stringify(socketData))
            
            const updatePositions = (positions: Position[], socketData: any) => {
              return positions.map((position) => {
                if (position.symbol === socketData.symbol) {
                  let multiplier = 100;
                          if (position.symbol.startsWith('EUR')) {
                            multiplier = 100000;
                          }else if (position.symbol.startsWith('AUD')) {
                            multiplier = 100000;
                          } else if (position.symbol.startsWith('BTC')) {
                            multiplier = 1;
                          }
                  const newPosition: Position = {
                    ...position,
                    close_price: socketData.bid,
                    profit: parseFloat(((socketData.bid - position.open_price) * position.volume * multiplier).toFixed(2)),
                  };

                  const a =setProfit(profit+(newPosition.profit-position.profit))
                  return newPosition;
                }
                return position;
              });
              
            };
            
            setPositions((prevPositions) => updatePositions(prevPositions, socketData));
            
            
            
          });
            /*positions.forEach((position) => {
              sum+=position.profit;
            });
            console.log("this is sum " + sum );
            setProfit(sum);*/
        };
    
        fetchData();
      }, []);
      const formatProfit = (num: number) => {
         return parseFloat(num.toFixed(2));
      };
    
      return (
        <div className='m-3 mx-5'>
        <Table columns={columns} dataSource={positions} />
        <div className='mx-auto'>
          <p>Total Profit : {formatProfit(profit)}</p>
        </div>
        </div>
        );
};


export default Positions;
