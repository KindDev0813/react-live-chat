import React, { useState, useRef } from 'react';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/menu';
import { BsFillGearFill } from 'react-icons/bs';
import { FaRegCopy } from 'react-icons/fa';
import { BiExit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { FaBan } from 'react-icons/fa';
import { Button, IconButton } from '@chakra-ui/button';
import { useClipboard, useDisclosure } from '@chakra-ui/hooks';
import firebase from 'firebase/app';

import { useAuth } from '../../state/authState';
import { db } from '../../firebase';
import { useHistory } from 'react-router';
import { getKeyOfRoom } from '../../utils/helpers';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/modal';
import BanUsersModel from './BanUsersModel';
import { RoomType } from '../../pages/Room';

interface RoomRightDropdownProps {
  room: RoomType;
}

const RoomRightDropdown: React.FC<RoomRightDropdownProps> = ({ room }) => {
  const { roomId, admin: roomAdmin, roomMates, bannedUsers } = room;
  const { hasCopied, onCopy } = useClipboard(roomId);
  const authUser = useAuth((state) => state.authUser);
  const cancelRef = useRef();
  const history = useHistory();
  const {
    isOpen: isOpenModel,
    onOpen: onOpenModel,
    onClose: onCloseModel,
  } = useDisclosure();
  const onClose = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLeaveRoom = async () => {
    const userRef = db.collection('users').doc(authUser?.uid);
    const room = db.collection('rooms').doc(roomId);
    try {
      await room.update({
        roomMates: firebase.firestore.FieldValue.arrayRemove({
          uid: authUser?.uid,
          username: authUser?.username,
        }),
      });
      await userRef.update({
        activeRooms: firebase.firestore.FieldValue.arrayRemove(room.id),
      });
      // removing from dashboard rooms
      const res = await db.collection('dashrooms').doc(authUser?.uid).get();
      const resData = res.data();
      const key: number = getKeyOfRoom(resData, roomId);
      const obj: any = {};
      obj[key] = firebase.firestore.FieldValue.delete();
      await db.collection('dashrooms').doc(authUser?.uid).update(obj);
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
    }
    onClose();
    history.push('/dashboard');
  };

  const handleDeleteRoom = async () => {
    setDeleting((deleting) => !deleting);
    try {
      const roomDoc = await db.collection('rooms').doc(roomId).get();
      const roomData = roomDoc.data();
      if (!roomData) {
        console.log('No room data');
        return;
      }
      const roomMates = roomData.roomMates;
      await db.collection('rooms').doc(roomId).delete();

      //! reduce async function
      await roomMates.reduce(
        async (promise: any, user: { uid: string; username: string }) => {
          await promise;
          const userRef = db.collection('users').doc(user.uid);
          await userRef.update({
            activeRooms: firebase.firestore.FieldValue.arrayRemove(roomId),
          });
          // removing from dashboard rooms
          const res = await db.collection('dashrooms').doc(user?.uid).get();
          const resData = res.data();
          const key: number = getKeyOfRoom(resData, roomId);
          const obj: any = {};
          obj[key] = firebase.firestore.FieldValue.delete();
          await db.collection('dashrooms').doc(user.uid).update(obj);
          console.log(`Done for ${user.username}`);
        },
        Promise.resolve()
      );
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
    }
    setDeleting((deleting) => !deleting);
    history.push('/dashboard');
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={
            <BsFillGearFill style={{ color: 'teal', fontSize: '1.24rem' }} />
          }
          size="sm"
          variant="ghost"
          _hover={{
            bg: 'transparent',
          }}
        />
        <MenuList>
          <MenuItem onClick={onCopy} icon={<FaRegCopy size={18} />}>
            {hasCopied ? 'Copied' : 'Copy Room Id'}
          </MenuItem>
          {authUser?.username !== roomAdmin && (
            <MenuItem
              color="red.500"
              onClick={handleLeaveRoom}
              icon={<BiExit size={18} />}
            >
              Leave Room
            </MenuItem>
          )}
          <MenuDivider />
          {authUser?.username === roomAdmin && (
            <MenuItem
              color="red.500"
              onClick={() => {
                onOpenModel();
              }}
              icon={<FaBan size={18} />}
            >
              Ban Roommates
            </MenuItem>
          )}
          {authUser?.username === roomAdmin && (
            <MenuItem
              color="red.500"
              onClick={() => setIsOpen(true)}
              icon={<AiFillDelete size={18} />}
            >
              Delete Room
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef.current}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Room
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You will lose all the messages of the room and
              roommates
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteRoom}
                ml={3}
                isLoading={deleting}
                disabled={deleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <BanUsersModel
        isOpen={isOpenModel}
        onClose={onCloseModel}
        roomMates={roomMates}
        roomId={roomId}
        bannedUsers={bannedUsers}
      />
      {/* ban users model */}
    </>
  );
};

export default RoomRightDropdown;
