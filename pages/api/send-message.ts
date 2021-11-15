// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { Message } from '../index';

type Data = {
  name: string;
};

// copy example
const PUSHER_APP_ID = process.env.PUSHER_APP_ID as string;
const PUSHER_KEY = process.env.PUSHER_KEY as string;
const PUSHER_SECRET = process.env.PUSHER_SECRET as string;
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER as string;

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
  const { message, id }: Message = JSON.parse(req.body);
  console.log(message, id, req.body);
  const pushRes = await pusher
    .trigger(`${process.env.PUSHER_CHANNEL}`, 'my-event', { message: message })
    .catch((error) => {
      console.log(error);
    });
  return pushRes;
};

// module.exports = async (req, res) => {
// const { x0, x1, y0, y1, color } = req.body;
// try {
//   await new Promise((resolve, reject) => {
//     pusher.trigger('drawing-events', 'drawing', { x0, x1, y0, y1, color }, (err) => {
//       if (err) return reject(err);
//       resolve();
//     });
//   });
//   res.status(200).end('sent event succesfully');
// } catch (e) {
//   console.log(e.message);
// }
// };
