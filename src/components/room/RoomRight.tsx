import React, { useEffect, useState } from 'react';
import { IconButton } from '@chakra-ui/button';
import { Box, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { BsFillGearFill } from 'react-icons/bs';
import { FaRegCopy } from 'react-icons/fa';
import { BiExit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';

import { RoomType } from '../../pages/Room';
import { useAuth } from '../../state/authState';
import RoomChatInput from './RoomChatInput';
import { useClipboard } from '@chakra-ui/hooks';
import RoomMessage, { RoomMessageType } from './RoomMessage';
import { db } from '../../firebase';

interface RoomRightProps {
  room: RoomType;
}

const RoomRight: React.FC<RoomRightProps> = ({ room }) => {
  const { roomName, roomId, admin: roomAdmin } = room;
  const authUser = useAuth((state) => state.authUser);
  const { hasCopied, onCopy } = useClipboard(roomId);
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

  const handleLeaveRoom = () => {};
  const handleDeleteRoom = () => {};

  return (
    <Box h="100%" width="70%" borderRight="1px" borderColor="blackAlpha.200">
      <Box
        w="100%"
        p="3"
        h="8%"
        borderBottom="1px"
        borderColor="blackAlpha.200"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="lg">{roomName}</Text>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={
              <BsFillGearFill style={{ color: 'teal', fontSize: '1.24rem' }} />
            }
            size="sm"
            variant="ghost"
            _hover={{
              bg: 'transparent',
            }}
          />
          <MenuList>
            <MenuItem onClick={onCopy} icon={<FaRegCopy size={18} />}>
              {hasCopied ? 'Copied' : 'Copy Room Id'}
            </MenuItem>
            {authUser?.username !== roomAdmin && (
              <MenuItem
                color="red.500"
                onClick={handleLeaveRoom}
                icon={<BiExit size={18} />}
              >
                Leave Room
              </MenuItem>
            )}
            {authUser?.username === roomAdmin && (
              <MenuItem
                color="red.500"
                onClick={handleDeleteRoom}
                icon={<AiFillDelete size={18} />}
              >
                Delete Room
              </MenuItem>
            )}
          </MenuList>
        </Menu>
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
