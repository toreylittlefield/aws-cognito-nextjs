// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { Message } from '../index';
import { PUSHER_APP_ID, PUSHER_CLUSTER, PUSHER_KEY, PUSHER_SECRET } from '../../lib/pusherKeys';

type Data = {
  name: string;
};

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const response = await sendMessagePusher(req);
  res.status(200).json(response);
}

const sendMessagePusher = async (req: NextApiRequest) => {
  const { message, id }: Message = req.body;
  const pushRes = await pusher.trigger(`${process.env.PUSHER_CHANNEL}`, 'message', { message, id }).catch((error) => {
    console.log(error);
  });
  return pushRes;
};
