import { Button } from '@chakra-ui/button';
import { Checkbox } from '@chakra-ui/checkbox';
import { Box, Text } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import React, { useState } from 'react';
import firebase from 'firebase/app';

import { db } from '../../firebase';
import { useAuth } from '../../state/authState';
import { getKeyOfRoom } from '../../utils/helpers';
import { useToast } from '@chakra-ui/toast';

interface BanUsersModelProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  bannedUsers: { uid: string; username: string }[];
  roomMates: { uid: string; username: string }[];
}

const BanUsersModel: React.FC<BanUsersModelProps> = ({
  isOpen,
  onClose,
  roomMates,
  roomId,
  bannedUsers,
}) => {
  const authuser = useAuth((s) => s.authUser);
  const toast = useToast();
  const [toBan, setToBan] = useState<string[]>([]);
  const [l, setL] = useState(false);

  const handleBanUsers = async () => {
    const toBanUsers = roomMates.filter((mate) => toBan.includes(mate.uid));
    const room = db.collection('rooms').doc(roomId);
    if (toBanUsers.length === 0) {
      onClose();
      toast({
        title: `No users selected to ban`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setL((l) => !l);
      // ! add user to bannedUsers array of room
      await room.update({
        bannedUsers: [...bannedUsers, ...toBanUsers],
      });

      // ! del activerooms of user, roommates of room ,and dashroom of user
      await toBanUsers.reduce(
        async (promise: any, user: { uid: string; username: string }) => {
          await promise;
          const userRef = db.collection('users').doc(user.uid);
          await userRef.update({
            activeRooms: firebase.firestore.FieldValue.arrayRemove(roomId),
          });
          // remove name of user form roomMates of the room
          await room.update({
            roomMates: firebase.firestore.FieldValue.arrayRemove({
              uid: user.uid,
              username: user.username,
            }),
          });
          // removing from dashboard rooms
          const res = await db.collection('dashrooms').doc(user.uid).get();
          const resData = res.data();
          const key: number = getKeyOfRoom(resData, roomId);
          const obj: any = {};
          obj[key] = firebase.firestore.FieldValue.delete();
          await db.collection('dashrooms').doc(user.uid).update(obj);
        },
        Promise.resolve()
      );
      setL((l) => !l);
      onClose();
      toast({
        title: `Banned ${toBanUsers.length} users `,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setL((l) => !l);
      onClose();
      console.log(err.code);
      console.log(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Users to Ban</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {roomMates.map((mate: any) => (
            <Box d="flex" alignItems="center" key={mate.uid}>
              <Checkbox
                colorScheme="teal"
                isDisabled={mate.uid === authuser?.uid}
                mr="3"
                value={mate.uid}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (toBan.includes(e.target.value)) {
                    const newToBan = toBan.filter(
                      (item) => item !== e.target.value
                    );
                    setToBan(newToBan);
                  } else {
                    setToBan([...toBan, e.target.value]);
                  }
                }}
              />
              <Text>{mate.username}</Text>
            </Box>
          ))}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" onClick={handleBanUsers} isLoading={l}>
            Ban
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BanUsersModel;
