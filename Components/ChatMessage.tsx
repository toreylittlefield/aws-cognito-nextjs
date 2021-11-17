import React from 'react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { ListIcon, ListItem } from '@chakra-ui/layout';
import { Message } from '../pages/index';

type ChatMessageProps = {
  pusherMessage: Message;
  userName: string;
};

const ChatMessage = ({ pusherMessage, userName }: ChatMessageProps) => {
  const { message, userName: messageUserName, relativeTime } = pusherMessage;
  const isUserSame = userName === messageUserName;
  //   const listStyle = (a: string, b: string): string => (isUserSame ? a : b);
  return (
    <ListItem
      textAlign={isUserSame ? 'left' : 'right'}
      py={2}
      borderRadius={5}
      bg={isUserSame ? 'cyan.700' : 'purple.700'}
    >
      {isUserSame && <ListIcon as={CheckCircleIcon} color="green.500" />}
      {messageUserName + ' '}
      {relativeTime + ' '}
      {message}
      {!isUserSame && <ListIcon as={CheckCircleIcon} color="green.100" />}
    </ListItem>
  );
};

export { ChatMessage };
