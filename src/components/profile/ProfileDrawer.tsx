import { IconButton } from '@chakra-ui/button';
import { Box, Text } from '@chakra-ui/layout';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal';
import React, { useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';

import { db } from '../../firebase';
import { useAuth } from '../../state/authState';
import ProfileDrawerDefaultMarkup from './ProfileDrawerDefaultMarkup';
import ProfileDrawerEditMarkup from './ProfileDrawerEditMarkup';

interface UserProfileDrawerProps {
  onClose: () => void;
  isOpen: boolean;
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const authUser = useAuth((s) => s.authUser);
  const [data, setData] = useState<{
    createdRooms: number;
    activeRooms: number;
  }>({ createdRooms: 0, activeRooms: 0 });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const unsub = db
      .collection('dashrooms')
      .doc(authUser?.uid)
      .onSnapshot((qs) => {
        const state = { activeRooms: 0, createdRooms: 0 };
        const qsData = qs.data();
        const rooms = Object.values({ ...qsData });
        state.activeRooms = rooms.length;
        state.createdRooms = rooms.reduce((acc, curr) => {
          if (curr.admin === authUser?.username) return (acc += 1);
          else return acc;
        }, 0);
        setData(state);
      });
    return unsub;
  }, [authUser]);

  if (!data) return <></>;

  return (
    <Drawer
      onClose={() => {
        setEdit(false);
        onClose();
      }}
      isOpen={isOpen}
      size="md"
      placement="left"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Box
            textAlign="center"
            fontSize="3xl"
            d="flex"
            w="100"
            alignItems="center"
            justifyContent="center"
          >
            <Text>{edit ? 'Edit' : ''} User Profile </Text>
            {!edit && (
              <IconButton
                colorScheme="teal"
                size="sm"
                aria-label="Edit User Profile"
                icon={<AiOutlineEdit fontSize={20} />}
                ml="3"
                onClick={() => setEdit(true)}
              />
            )}
          </Box>
        </DrawerHeader>
        {edit ? (
          <ProfileDrawerEditMarkup edit={edit} setEdit={setEdit} />
        ) : (
          <ProfileDrawerDefaultMarkup
            data={data}
            username={authUser?.username}
            email={authUser?.email}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default UserProfileDrawer;
