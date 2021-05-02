import React from 'react';
import { Button } from '@chakra-ui/button';
import { FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Stack } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { useHistory } from 'react-router';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinRoomModel: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const history = useHistory();
  const [roomId, setRoomId] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="3xl">
          Join a Room
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="24px">
            <Box>
              <FormLabel htmlFor="roomid">Room Id</FormLabel>
              <Input
                id="roomid"
                placeholder="Enter Room Id"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose} variant="outline">
            Close
          </Button>
          <Button variant="solid" colorScheme="green" onClick={() => {}}>
            Join
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinRoomModel;
