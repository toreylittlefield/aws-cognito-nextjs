import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import * as PusherTypes from 'pusher-js';
import genRandom from '../lib/randomId';
import { NEXT_PUBLIC_PUSHER_CLUSTER, NEXT_PUBLIC_PUSHER_KEY } from '../lib/pusherKeys';

export type Message = {
  message: string;
  id: string;
};

const Home: NextPage = () => {
  const [pusherMessages, setPusherMessages] = useState<Message[]>([{ message: 'dummy', id: 'adsmdas11e2e1e3' }]);
  const [formInput, setFormInput] = useState<Message>({ message: '', id: genRandom().makeid(20) });

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    console.log(formInput);
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formInput),
    });
    // const json = await res.json();
    console.log(res);
    // return json;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormInput((prev) => {
      return {
        message: value,
        id: prev.id,
      };
    });
  };

  useEffect(() => {
    const pusher = new Pusher(`${NEXT_PUBLIC_PUSHER_KEY}`, {
      cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    const channelName = 'boar-coder-bingo';
    if (process.env.NODE_ENV !== 'production') {
      Pusher.logToConsole = true;
    }

    const channel = pusher.subscribe(channelName);
    channel.bind('message', function (data: Message) {
      const { message, id } = data;
      setPusherMessages((prev) => [...prev, { message, id }]);
    });
    return () => {
      if (pusher) pusher.unsubscribe(channelName);
    };
  }, []);

  return (
    <main style={{ display: 'grid', placeContent: 'center', minHeight: '100vh' }}>
      <section className="chat-box">
        <div className="pusherMessage">
          <ol>
            {pusherMessages.map((message) => (
              <li key={message.id}>{message.message}</li>
            ))}
          </ol>
        </div>
        <form onSubmit={handleSubmit}>
          <input placeholder="write a message" onChange={handleInputChange} />
          <button type="submit">Send Message</button>
        </form>
      </section>
    </main>
  );
};

export default Home;
