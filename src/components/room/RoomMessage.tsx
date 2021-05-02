import { Box, Text } from '@chakra-ui/layout';
import React from 'react';
import firebase from 'firebase/app';

interface RoomMessageProps {
  isAuthUser: boolean;
  text: string;
}

export type RoomMessageType = {
  message: string;
  sender: string;
  sentAt: firebase.firestore.FieldValue;
};

const RoomMessage: React.FC<RoomMessageProps> = ({ isAuthUser, text }) => {
  return (
    <>
      {isAuthUser ? (
        <Box
          bg="green.100"
          px="3"
          py="2"
          ml="auto"
          borderRadius="10px"
          borderTopRightRadius="0"
          my="1"
        >
          <Text>{text}</Text>
        </Box>
      ) : (
        <Box
          px="3"
          py="2"
          borderRadius="10px"
          borderTopLeftRadius="0"
          mr="auto"
          my="1"
          bg="blackAlpha.100"
        >
          <Text>{text}</Text>
        </Box>
      )}
    </>
  );
};

export default RoomMessage;
