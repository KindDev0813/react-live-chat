import React from 'react';
import { Image } from '@chakra-ui/image';
import { Box, Text } from '@chakra-ui/layout';
import ProfileRoomStatCard from './ProfileRoomStatCard';
import ProfileUsername from './ProfileUsername';
import { DrawerBody } from '@chakra-ui/modal';

interface ProfileDrawerDefaultMarkupProps {
  data: { activeRooms: number; createdRooms: number };
  username: string | undefined;
  email: string | undefined;
}

const ProfileDrawerDefaultMarkup: React.FC<ProfileDrawerDefaultMarkupProps> = ({
  data,
  email,
  username,
}) => {
  return (
    <DrawerBody>
      <Box w="100%" display="flex" flexDir="column" alignItems="center" mt="3">
        <Box
          boxSize="18rem"
          d="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            boxSize=""
            src="https://bit.ly/prosper-baba"
            alt="Segun Adebayo"
            borderRadius="full"
          />
        </Box>
        <ProfileUsername username={username} />
        <Text>{email}</Text>
        <Box
          w="100%"
          d="flex"
          alignItems="center"
          justifyContent="space-between"
          mt="4"
          h="36"
        >
          <ProfileRoomStatCard text="Rooms Created" count={data.activeRooms} />
          <ProfileRoomStatCard text="Rooms Created" count={data.createdRooms} />
        </Box>
      </Box>
    </DrawerBody>
  );
};

export default ProfileDrawerDefaultMarkup;
