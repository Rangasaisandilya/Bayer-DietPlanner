// utils/response.ts
import { Response } from 'express';
import { encryptResponse } from '../middlewares/middleware';

type ResponsePayload = {
  status: boolean;
  message: string;
  data?: any;
  errors?: { [key: string]: string }[] | string[];
  token?: string;
  user?: any;
  total?:any;
};

const encrypt = true

export const sendResponse = (
  res: Response,
  statusCode: number,
  payload: ResponsePayload
): void => {
  const respayload= {
    status: payload.status,
    message: payload.message,
    ...(payload.data && { data: payload.data }),
    ...(payload.errors && { errors: payload.errors }),
    ...(payload.token && { token: payload.token }),
    ...(payload.user && { user: payload.user }),
    ...(payload.total && { total: payload.total }),
  }
  const encryptResponseData = encrypt ? encryptResponse(respayload) : respayload;
  res.status(statusCode).json(encryptResponseData);
};
