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

const CreateRoomModel: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const history = useHistory();
  const toast = useToast();
  const [data, setData] = useState({ roomName: '' });
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = () => {
    onClose();
  };

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
          Create a Room
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="24px">
            <Box>
              <FormLabel htmlFor="roomname">Room Name</FormLabel>
              <Input
                id="roomname"
                placeholder="Enter the room name"
                value={data.roomName}
                onChange={(e) => setData({ ...data, roomName: e.target.value })}
              />
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose} variant="outline">
            Close
          </Button>
          <Button
            variant="solid"
            colorScheme="green"
            onClick={handleCreateRoom}
            isLoading={loading}
            loadingText="Creating..."
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModel;
