import { Box, Text } from '@chakra-ui/layout';
import React from 'react';

interface ProfileRoomStatCardProps {
  text: string;
  count: number;
}

const ProfileRoomStatCard: React.FC<ProfileRoomStatCardProps> = ({
  count,
  text,
}) => {
  return (
    <Box
      width="48%"
      h="100%"
      d="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      p="2"
      shadow="xl"
      _hover={{
        shadow: '2xl',
      }}
    >
      <Text fontSize="lg">{text}</Text>
      <Text fontSize="4xl">{count}</Text>
    </Box>
  );
};

export default ProfileRoomStatCard;
