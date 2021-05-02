import React from 'react';
import { Flex, Text } from '@chakra-ui/layout';

interface DashBoardCardProps {
  title: string;
  onOpen: () => void;
  icon: JSX.Element;
}

const DashBoardCard: React.FC<DashBoardCardProps> = ({
  title,
  icon,
  onOpen,
}) => {
  return (
    <Flex
      onClick={onOpen}
      boxShadow="lg"
      _hover={{
        boxShadow: 'xl',
      }}
      bg="blackAlpha.100"
      w={['100%', '100%', '50%', '60%']}
      h="50%"
      m="4"
      py="12"
      borderRadius="md"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      cursor="pointer"
      textAlign="center"
    >
      {icon}
      <Text mt="6" fontSize="3xl">
        {title}
      </Text>
    </Flex>
  );
};

export default DashBoardCard;
