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
  const [profit, setProfit] = useState(4.44);
  
  
  useEffect(() => {
   
        const fetchData = async () => {
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
    
          
          socket.on('feeds', (socketData: any) => {
            
            const positionsToUpdate = serverData.filter((position) => {
              return socketData.some((socketDatum: any) => {
                return socketDatum.symbol === position.symbol;
              });
            });
    
            
            positionsToUpdate.forEach((position) => {
              const updatedPosition = {
                ...position,
                price: socketData.find((socketDatum: any) => {
                  return socketDatum.symbol === position.symbol;
                }).price,
              };
    
              
              const positionIndex = serverData.findIndex((pos) => pos.key === position.key);
    
              
              const newData = [...serverData];
              newData[positionIndex] = updatedPosition;
              let sum = 0;
              let closePrice = 0;
              let openPrice = 0;
              let profit = 0;
              let lotSize = 0;

              positions.forEach((position) => {
                closePrice = position.close_price;
                openPrice = position.open_price;
                lotSize = position.volume;
                if(position.symbol.endsWith("USD"))
                profit = ((closePrice-openPrice)*lotSize)*100;
                else if(position.symbol.endsWith("JPY"))
                profit = ((closePrice-openPrice)*lotSize)*90;
                else
                profit = ((closePrice-openPrice)*lotSize)*80;

                position.profit = profit;
                sum +=profit;
              })

              setProfit(sum);
              
              setPositions(newData);

              
              
            });
          });
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
