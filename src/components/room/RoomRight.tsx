import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/layout';

import { RoomType } from '../../pages/Room';
import { useAuth } from '../../state/authState';
import RoomChatInput from './RoomChatInput';
import RoomMessage, { RoomMessageType } from './RoomMessage';
import { db } from '../../firebase';
import RoomRightDropdown from './RoomRightDropdown';

interface RoomRightProps {
  room: RoomType;
}

const RoomRight: React.FC<RoomRightProps> = ({ room }) => {
  const { roomName, roomId, admin: roomAdmin } = room;
  const authUser = useAuth((state) => state.authUser);
  const [messages, setMessages] = useState<RoomMessageType[]>([]);

  useEffect(() => {
    const unsub = db
      .collection('roomMessages')
      .doc(roomId)
      .collection('messages')
      .orderBy('sentAt', 'desc')
      .onSnapshot((qs) => {
        const messages: RoomMessageType[] = qs.docs
          .map((doc) => doc.data())
          .map((msgDoc) => ({
            message: msgDoc.message,
            sender: msgDoc.sender,
            sentAt: msgDoc.sentAt,
          }));

        setMessages(messages);
      });

    return () => {
      unsub();
    };
  }, [roomId, setMessages]);

  return (
    <Box h="100%" width="70%" borderRight="1px" borderColor="blackAlpha.200">
      <Box
        w="100%"
        p="3"
        h="8%"
        borderBottom="1px"
        borderColor="blackAlpha.300"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex flexDirection="column" justifyContent="center">
          <Text fontSize="lg">{roomName}</Text>
          <Text fontSize="small" textColor="teal.400">
            created by {roomAdmin}
          </Text>
        </Flex>
        <RoomRightDropdown roomAdmin={roomAdmin} roomId={roomId} />
      </Box>

      <Box h="92%">
        <Box
          h="90%"
          overflowY="scroll"
          px="3"
          display="flex"
          flexDirection="column-reverse"
        >
          {messages.map((msg: any) => {
            return (
              <RoomMessage
                text={msg.message}
                isAuthUser={authUser?.username === msg.sender}
                key={Math.floor(Math.random() * 99999999)}
                sender={msg.sender}
              />
            );
          })}
        </Box>
        <RoomChatInput roomId={roomId} sender={authUser!.username} />
      </Box>
    </Box>
  );
};

export default RoomRight;
