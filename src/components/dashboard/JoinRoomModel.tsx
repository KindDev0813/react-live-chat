import React from 'react';
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
import { useState } from 'react';
import { useHistory } from 'react-router';
//
import { db } from '../../firebase';
import { useAuth } from '../../state/authState';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinRoomModel: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const history = useHistory();
  const authUser = useAuth((state) => state.authUser);
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinRoom = async () => {
    const userRef = db.collection('users').doc(authUser?.uid);
    if (roomId.trim() === '') return setError('Empty Room Id is not allowed');

    try {
      setLoading((l) => !l);
      setError('');
      const room = await db.collection('rooms').doc(roomId);
      const roomDoc = await room.get();
      if (!roomDoc.exists) {
        setLoading((l) => !l);
        return setError('Invalid Room Id');
      }
      const roomData = roomDoc.data();
      if (!roomData) {
        onClose();
        setLoading((l) => !l);
        return;
      }
      const isUserThere = roomData.roomMates
        .map((user: any) => user.uid)
        .includes(authUser?.uid);

      if (isUserThere) {
        onClose();
        setLoading((loading) => !loading);
        history.push(`/room/${roomId}`);
        return toast({
          title: `Already in room ${roomData.roomName}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      await room.update({
        roomMates: firebase.firestore.FieldValue.arrayUnion({
          uid: authUser?.uid,
          username: authUser?.username,
        }),
      });
      await userRef.update({
        activeRooms: firebase.firestore.FieldValue.arrayUnion(room.id),
      });
      toast({
        title: `Joined room ${roomData.roomName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      history.push(`/room/${roomId}`);
      setRoomId('');
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
    }
    setLoading((l) => !l);
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
          Join a Room
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="24px">
            <Box>
              <FormControl isRequired isInvalid={error ? true : false}>
                <FormLabel htmlFor="roomid">Room Id</FormLabel>
                <Input
                  id="roomid"
                  placeholder="Enter Room Id"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
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
            onClick={handleJoinRoom}
            isLoading={loading}
            loadingText="Joining..."
          >
            Join
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinRoomModel;
