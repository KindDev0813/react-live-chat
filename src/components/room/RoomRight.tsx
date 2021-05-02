import React from 'react';
import { IconButton } from '@chakra-ui/button';
import { Box, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { BsFillGearFill } from 'react-icons/bs';
import { FaRegCopy } from 'react-icons/fa';
import { BiExit } from 'react-icons/bi';

import { RoomType } from '../../pages/Room';
import { useAuth } from '../../state/authState';
import RoomChatInput from './RoomChatInput';

interface RoomRightProps {
  room: RoomType;
}

const RoomRight: React.FC<RoomRightProps> = ({ room }) => {
  const { roomName, roomId } = room;
  const authUser = useAuth((state) => state.authUser);

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
            {/* <MenuItem onClick={onCopy} icon={<FaRegCopy />}>
              {hasCopied ? 'Copied' : 'Copy Room Id'}
            </MenuItem>
            {currentUser.displayName !== roomAdmin && (
              <MenuItem onClick={handleLeaveRoom} icon={<BiExit />}>
                Leave Room
              </MenuItem>
            )}
            {currentUser.displayName === roomAdmin && (
              <MenuItem
                color="red.500"
                onClick={handleLeaveRoom}
                icon={<AiFillDelete />}
              >
                Delete Room
              </MenuItem>
            )} */}
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
          {/* {msgs.map((msg) => {
            return (
              <Message
                text={msg.msg}
                isAuthUser={authUser?.username === msg.sender}
                key={Math.floor(Math.random() * 99999999)}
              />
            );
          })} */}
        </Box>
        <RoomChatInput roomId={roomId} sender={authUser!.username} />
      </Box>
    </Box>
  );
};

export default RoomRight;
