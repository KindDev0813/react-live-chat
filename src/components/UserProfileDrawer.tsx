import { Image } from '@chakra-ui/image';
import { Box, Text } from '@chakra-ui/layout';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../state/authState';

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
    createdRooms: number | undefined;
    activeRooms: number | undefined;
  }>();

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

  console.log(data);

  if (!data) return <></>;

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="md" placement="left">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Text textAlign="center" fontSize="3xl">
            User Profile
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Box
            w="100%"
            display="flex"
            flexDir="column"
            alignItems="center"
            mt="3"
          >
            <Box
              boxSize="18rem"
              d="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                boxSize=""
                src="https://bit.ly/prosper-baba"
                alt="Segun Adebayo"
                borderRadius="full"
              />
            </Box>
            <Box w="100%" textAlign="center" mt="5">
              <Text fontSize="3xl" fontWeight="bolder">
                {authUser?.username}
              </Text>
              <Text>{authUser?.email}</Text>
            </Box>
            <Box
              w="100%"
              d="flex"
              alignItems="center"
              justifyContent="space-between"
              mt="4"
              h="36"
            >
              <Box
                width="48%"
                h="100%"
                d="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="center"
                p="2"
                shadow="xl"
                _hover={{
                  shadow: '2xl',
                }}
              >
                <Text fontSize="lg">Rooms Active</Text>
                <Text fontSize="4xl">{data?.activeRooms}</Text>
              </Box>
              <Box
                width="48%"
                h="100%"
                d="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="center"
                p="2"
                shadow="xl"
                _hover={{
                  shadow: '2xl',
                }}
              >
                <Text fontSize="lg">Rooms Created</Text>
                <Text fontSize="4xl">{data?.createdRooms}</Text>
              </Box>
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default UserProfileDrawer;
