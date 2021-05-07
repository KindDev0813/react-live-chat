// import { ButtonGroup, IconButton } from '@chakra-ui/button';
import { Box, Text } from '@chakra-ui/layout';
// import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import React from 'react';
const ProfileUsername: React.FC<{ username: string | undefined }> = ({
  username,
}) => {
  return (
    <Box w="100%" textAlign="center" mt="5">
      <Text fontSize="3xl" fontWeight="bolder">
        {username}
      </Text>
    </Box>
  );
};

export default ProfileUsername;
