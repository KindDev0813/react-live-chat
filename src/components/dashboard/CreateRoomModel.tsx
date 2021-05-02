import { useState } from 'react';
import firebase from 'firebase/app';
import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
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
// import { useHistory } from 'react-router';
import { db } from '../../firebase';
import { useAuth } from '../../state/authState';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomModel: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  // const history = useHistory();
  const toast = useToast();
  const authUser = useAuth((state) => state.authUser);
  const [data, setData] = useState({ roomName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    if (data.roomName.trim() === '')
      return setError('Empty room name is not allowed');
    const roomData = {
      roomName: data.roomName,
      admin: authUser?.username,
      roomMates: [{ username: authUser?.username, uid: authUser?.uid }],
    };
    try {
      setLoading((loading) => !loading);
      const room = await db.collection('rooms').add(roomData);
      await db.collection('rooms').doc(room.id).update({ roomId: room.id });
      await db
        .collection('users')
        .doc(authUser?.uid)
        .update({
          activeRooms: firebase.firestore.FieldValue.arrayUnion(room.id),
        });
      toast({
        title: `Joined room ${data.roomName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setData({ roomName: '' });
      console.log('will push to room page');
      // history.push(`/room/${room.id}`);
    } catch (err) {
      console.log('error in creating a room');
    }

    setLoading((loading) => !loading);
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
              <FormControl isRequired isInvalid={error ? true : false}>
                <FormLabel htmlFor="roomname">Room Name</FormLabel>
                <Input
                  id="roomname"
                  placeholder="Enter the room name"
                  value={data.roomName}
                  onChange={(e) =>
                    setData({ ...data, roomName: e.target.value })
                  }
                />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
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
