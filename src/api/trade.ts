import axios from 'axios';




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
const apiRequest = async (url:string): Promise<any> => {
  try {
    const response = await api.post(url, data);
    console.log("API Data "+ response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Position Data Not Found")
  }
}

export const tradeData = async(): Promise<any> => {
  console.log("Getting Data")
  return apiRequest("/positionget")
}