import React, { useEffect, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { Box, Divider, Text, VStack } from '@chakra-ui/layout';
import firebase from 'firebase/app';
import { FaRegTimesCircle } from 'react-icons/fa';
import { Button, IconButton } from '@chakra-ui/button';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/popover';
import { db } from '../../firebase';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable';

interface RoomMessageProps {
  isAuthUser: boolean;
  text: string;
  sender: string;
  id: string;
  roomId: string;
}

export type RoomMessageType = {
  id: string;
  message: string;
  sender: string;
  sentAt: firebase.firestore.FieldValue;
};

const RoomMessage: React.FC<RoomMessageProps> = ({
  text,
  sender,
  isAuthUser,
  id,
  roomId,
}) => {
  const [edit, setEdit] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edit === true) inputRef.current?.focus();
  }, [edit]);

  const handleMessageDelete = async () => {
    await db
      .collection('roomMessages')
      .doc(roomId)
      .collection('messages')
      .doc(id)
      .update({
        message: '',
      });
  };
  const handleMessageEdit = async () => {
    const updatedMessage = inputRef.current?.value;
    if (updatedMessage?.trim() === '' || updatedMessage?.trim() === text) {
      setEdit(false);
      return;
    }

    await db
      .collection('roomMessages')
      .doc(roomId)
      .collection('messages')
      .doc(id)
      .update({
        message: updatedMessage,
      });
    setEdit(false);
  };

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
        {isAuthUser && text !== '' && (
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
                      borderTopLeftRadius="base"
                      borderTopRightRadius="base"
                      onClick={handleMessageDelete}
                    >
                      Delete Message
                    </Button>
                    <Divider marginTop="0 !important" />
                    <Button
                      width="100%"
                      borderRadius="unset"
                      variant="ghost"
                      color="gray.600"
                      marginTop="0 !important"
                      borderBottomLeftRadius="base"
                      borderBottomRightRadius="base"
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      Edit Message
                    </Button>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        )}
        {text !== '' && (
          <Text
            fontWeight="medium"
            fontStyle="italic"
            fontSize="0.8rem"
            textAlign={isAuthUser ? 'right' : 'left'}
          >
            {sender}
          </Text>
        )}
      </Box>
      <Box>
        {text === '' ? (
          <Box display="flex" alignItems="center">
            <FaRegTimesCircle />
            <Text ml="1" fontStyle="italic">
              This message is deleted
            </Text>
          </Box>
        ) : (
          <Box>
            <Text textAlign="right">{!edit && text}</Text>
            {edit && (
              <Editable
                defaultValue={text}
                startWithEditView={true}
                onSubmit={handleMessageEdit}
              >
                <EditablePreview width="100%" textAlign="right" />
                <EditableInput ref={inputRef} textAlign="left" />
              </Editable>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RoomMessage;
