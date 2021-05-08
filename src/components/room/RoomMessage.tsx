import React from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { Box, Divider, Text, VStack } from '@chakra-ui/layout';
import firebase from 'firebase/app';
import { Button, IconButton } from '@chakra-ui/button';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/popover';

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
    <RoomMessageLayout text={text} sender={sender} isAuthUser={isAuthUser} />
  );
};

const RoomMessageLayout: React.FC<{
  text: string;
  sender: string;
  isAuthUser: boolean;
}> = ({ text, sender, isAuthUser }) => {
  return (
    <Box
      bg={isAuthUser ? 'green.100' : 'blackAlpha.100'}
      px="3"
      py="2"
      ml={isAuthUser ? 'auto' : 'inherit'}
      mr={isAuthUser ? 'inherit' : 'auto'}
      borderRadius="10px"
      borderTopRightRadius={isAuthUser ? 0 : '10px'}
      borderTopLeftRadius={isAuthUser ? '10px' : 0}
      my="1"
      maxW="75%"
      className="message"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {isAuthUser && (
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            <Popover placement="top-start">
              <PopoverTrigger>
                <IconButton
                  colorScheme="teal"
                  aria-label="Send email"
                  variant="link"
                  visibility="hidden"
                  sx={{
                    '.message:hover &': {
                      visibility: 'visible',
                    },
                  }}
                  icon={<BiDotsHorizontalRounded size={20} />}
                />
              </PopoverTrigger>
              <PopoverContent w="fit-content" p="0">
                <PopoverArrow />
                <PopoverBody padding="0">
                  <VStack>
                    <Button
                      variant="ghost"
                      width="100%"
                      borderRadius="unset"
                      color="red.400"
                    >
                      Delete Message
                    </Button>
                    <Divider p="0" m="0" />
                    <Button
                      width="100%"
                      borderRadius="unset"
                      variant="ghost"
                      color="gray.600"
                    >
                      Edit Message
                    </Button>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        )}
        <Text
          fontWeight="medium"
          fontStyle="italic"
          fontSize="0.8rem"
          textAlign={isAuthUser ? 'right' : 'left'}
        >
          {sender}
        </Text>
      </Box>
      <Text textAlign="right">{text}</Text>
    </Box>
  );
};

export default RoomMessage;
