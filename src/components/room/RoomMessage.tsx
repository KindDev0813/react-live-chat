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
          maxW="75%"
        >
          <Text
            fontWeight="medium"
            fontStyle="italic"
            fontSize="0.8rem"
            textAlign="right"
          >
            {sender}
          </Text>
          <Text fontSize="medium">{text}</Text>
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
          maxW="75%"
        >
          <Text
            fontWeight="medium"
            fontStyle="italic"
            fontSize="0.8rem"
            textAlign="left"
          >
            {sender}
          </Text>
          <Text>{text}</Text>
        </Box>
      )}
    </>
  );
};

export default RoomMessage;
