import { Box, Text } from '@chakra-ui/layout';
import React from 'react';
import firebase from 'firebase/app';

interface RoomMessageProps {
  isAuthUser: boolean;
  text: string;
  sender: string;
}

export type RoomMessageType = {
  message: string;
  sender: string;
  sentAt: firebase.firestore.FieldValue;
};

const RoomMessage: React.FC<RoomMessageProps> = ({
  isAuthUser,
  text,
  sender,
}) => {
  return (
    <RoomMessageLayout text={text} sender={sender} isAuthUser={isAuthUser} />
  );
};

const RoomMessageLayout: React.FC<{
  text: string;
  sender: string;
  isAuthUser: boolean;
}> = ({ text, sender, isAuthUser }) => {
  return (
    <Box
      bg={isAuthUser ? 'green.100' : 'blackAlpha.100'}
      px="3"
      py="2"
      ml={isAuthUser ? 'auto' : 'inherit'}
      mr={isAuthUser ? 'inherit' : 'auto'}
      borderRadius="10px"
      borderTopRightRadius={isAuthUser ? 0 : 'inherit'}
      borderTopLeftRadius={isAuthUser ? 'inherit' : 0}
      my="1"
      maxW="75%"
    >
      <Text
        fontWeight="medium"
        fontStyle="italic"
        fontSize="0.8rem"
        textAlign={isAuthUser ? 'right' : 'left'}
      >
        {sender}
      </Text>
      <Text>{text}</Text>
    </Box>
  );
};

export default RoomMessage;
