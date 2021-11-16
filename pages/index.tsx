import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import * as PusherTypes from 'pusher-js';
import genRandom from '../lib/randomId';
import { NEXT_PUBLIC_PUSHER_CLUSTER, NEXT_PUBLIC_PUSHER_KEY } from '../lib/pusherKeys';
import { getRelativeTimeDate } from '../lib/relativeTime';
import { Box, Button, Container, Flex, Input, OrderedList } from '@chakra-ui/react';
import { ChatMessage } from '../Components/';

export type Message = {
  message: string;
  id: string;
  timeStamp: Date | number;
  relativeTime?: string;
  userName: string;
};

const Home: NextPage = () => {
  const [pusherMessages, setPusherMessages] = useState<Message[] | null>();
  const [formInput, setFormInput] = useState({ message: '' });
  const [userName, setUserName] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const msgToSend: Message = {
      id: genRandom().makeid(20),
      message: formInput.message,
      timeStamp: Date.now(),
      userName: userName,
    };

    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(msgToSend),
    });
    if (res.ok) {
      console.log(res.ok);
    }
    setFormInput({ message: '' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormInput((prev) => {
      const tmp = prev;
      return {
        ...tmp,
        message: value,
      };
    });
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserName(value);
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
      setPusherMessages((prev) => {
        const relativeTime = getRelativeTimeDate(data.timeStamp);
        if (Array.isArray(prev)) return [...prev, { ...data, relativeTime }];
        else return [{ ...data, relativeTime }];
      });
    });
    return () => {
      if (pusher) pusher.unsubscribe(channelName);
    };
  }, []);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="purple.600" color="gray.100">
      <Container bg="blue.600" className="chat-box" minW="50%" p={5} borderRadius={25}>
        <Box className="pusherMessage">
          <OrderedList listStyleType="none" m={5} spacing={3}>
            {pusherMessages?.map((pusherMessage) => (
              <ChatMessage key={pusherMessage.id} pusherMessage={pusherMessage} userName={userName} />
            ))}
          </OrderedList>
        </Box>
        <form onSubmit={handleSubmit}>
          <Input placeholder="write a message" onChange={handleInputChange} value={formInput.message} />
          <Button
            justifySelf="flex-end"
            bg="green.300"
            type="submit"
            disabled={formInput.message.length === 0 || userName.length >= 10}
          >
            Send Message
          </Button>
        </form>
        <Input placeholder="add a username" onChange={handleUserChange} value={userName} />
      </Container>
    </Flex>
  );
};

export default Home;
