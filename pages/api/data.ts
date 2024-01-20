'use server'
import { Position } from '@/types/position';
import axios from 'axios';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const api = axios.create({
    baseURL: 'http://173.249.49.52:18080',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.NEXT_PUBLIC_API_AUTH,
    }
  });

  const data = {
    token: process.env.NEXT_PUBLIC_API_TOKEN
  };
  //export const apiData= async () => {
    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        console.log("Inside Handler")
    
        const api = axios.create({
            baseURL: 'http://173.249.49.52:18080',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.NEXT_PUBLIC_API_AUTH,
            }
          });
          const dat = {
            token: process.env.NEXT_PUBLIC_API_TOKEN
          };
          console.log("Making Api Call")
          const response = await api.post("/positionget",dat);
          const serverData: Position[] = response.data;
          console.log("got data "+response.data)
          res.status(200).json(serverData)
    }
