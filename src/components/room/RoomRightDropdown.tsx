import React from 'react';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { BsFillGearFill } from 'react-icons/bs';
import { FaRegCopy } from 'react-icons/fa';
import { BiExit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { IconButton } from '@chakra-ui/button';
import { useClipboard } from '@chakra-ui/hooks';
import firebase from 'firebase/app';

import { useAuth } from '../../state/authState';
import { db } from '../../firebase';
import { useHistory } from 'react-router';

interface RoomRightDropdownProps {
  roomId: string;
  roomAdmin: string;
}

const RoomRightDropdown: React.FC<RoomRightDropdownProps> = ({
  roomId,
  roomAdmin,
}) => {
  const { hasCopied, onCopy } = useClipboard(roomId);
  const authUser = useAuth((state) => state.authUser);
  const history = useHistory();

  const handleLeaveRoom = async () => {
    const userRef = db.collection('users').doc(authUser?.uid);
    const room = await db.collection('rooms').doc(roomId);
    await room.update({
      roomMates: firebase.firestore.FieldValue.arrayRemove({
        uid: authUser?.uid,
        username: authUser?.username,
      }),
    });
    await userRef.update({
      activeRooms: firebase.firestore.FieldValue.arrayRemove(room.id),
    });
    history.push('/dashboard');
  };
  const handleDeleteRoom = () => {};

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<BsFillGearFill style={{ color: 'teal', fontSize: '1.24rem' }} />}
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
        {authUser?.username === roomAdmin && (
          <MenuItem
            color="red.500"
            onClick={handleDeleteRoom}
            icon={<AiFillDelete size={18} />}
          >
            Delete Room
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default RoomRightDropdown;
