import { Badge, Box, Divider, Text } from '@chakra-ui/layout';
import React from 'react';

interface RoomLeftProps {
  roomMates: { uid: String; username: string }[];
  roomAdmin: string;
}

const RoomLeft: React.FC<RoomLeftProps> = ({ roomMates, roomAdmin }) => {
  return (
    <Box h="100%" width="30%" borderRight="1px" borderColor="blackAlpha.200">
      <Box
        w="100%"
        h="8%"
        pl="3"
        borderBottom="1px"
        borderColor="blackAlpha.300"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="lg">Roommates</Text>
      </Box>
      <Box px="4" overflowY="scroll" h="92%">
        {roomMates.map((mate) => {
          return (
            <div key={Math.ceil(Math.random() * 9999)}>
              <Box py="2" d="flex" flexDirection="column">
                <Text fontSize="md">
                  {mate.username}
                  {mate.username === roomAdmin && (
                    <Badge
                      variant="subtle"
                      colorScheme="green"
                      ml="4"
                      fontSize="0.7rem"
                    >
                      Admin
                    </Badge>
                  )}
                </Text>
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
