import { Box, Divider, Text } from '@chakra-ui/layout';
import React from 'react';

interface RoomLeftProps {
  roomMates: { uid: String; username: string }[];
}

const RoomLeft: React.FC<RoomLeftProps> = ({ roomMates }) => {
  return (
    <Box h="100%" width="30%" borderRight="1px" borderColor="blackAlpha.200">
      <Box
        w="100%"
        p="3"
        h="8%"
        borderBottom="1px"
        borderColor="blackAlpha.200"
      >
        <Text fontSize="lg">RoomMates</Text>
      </Box>
      <Box px="4" overflowY="scroll" h="92%">
        {roomMates.map((mate) => {
          return (
            <div key={Math.ceil(Math.round(100))}>
              <Box py="2" d="flex" flexDirection="column">
                <Text>{mate.username}</Text>
              </Box>
              <Divider />
            </div>
          );
        })}
      </Box>
    </Box>
  );
};

export default RoomLeft;
