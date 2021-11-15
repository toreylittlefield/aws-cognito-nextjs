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
  const pusher = new Pusher(`${NEXT_PUBLIC_PUSHER_KEY}`, {
    cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
  });
  const [pusherMessages, setPusherMessages] = useState<Message[]>([]);
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
    if (process.env.NODE_ENV !== 'production') {
      Pusher.logToConsole = true;
    }

    var channel = pusher.subscribe('boar-coders-bingo');
    channel.bind('message', function (data: Message) {
      alert(JSON.stringify(data));
      setPusherMessages((prev) => [...prev, data]);
    });
    return () => {
      // if(pusher) pusher.disconnect()
    };
  });

  return (
    <main style={{ display: 'grid', placeContent: 'center', minHeight: '100vh' }}>
      <div>{NEXT_PUBLIC_PUSHER_CLUSTER}</div>
      <div>{NEXT_PUBLIC_PUSHER_KEY}</div>
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
        </form>
        <button type="submit">Send Message</button>
      </section>
    </main>
  );
};

export default Home;
