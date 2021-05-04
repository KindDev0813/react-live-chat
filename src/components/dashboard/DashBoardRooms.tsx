import { Box, Stack, Text } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { RoomType } from '../../pages/Room';
import { useAuth } from '../../state/authState';
import DashBoardRoomCard from './DashBoardRoomCard';

const DashBoardRooms = () => {
  const authUser = useAuth((state) => state.authUser);
  const [rooms, setRooms] = useState<RoomType[] | null>();

  useEffect(() => {
    db.collection('dashrooms')
      .doc(authUser?.uid)
      .onSnapshot((qs) => {
        const qsData = qs.data();
        const rooms = Object.values({ ...qsData });
        setRooms(rooms);
      });
  }, [authUser?.uid]);

  if (!rooms) {
    return (
      <Box width="90%" mx="auto">
        <Skeleton height="30px" width="25%" mb="5" />
        <Stack>
          <Skeleton height="30px" startColor="gray.100" endColor="gray.300" />
          <Skeleton height="30px" startColor="gray.100" endColor="gray.300" />
          <Skeleton height="30px" startColor="gray.100" endColor="gray.300" />
        </Stack>
      </Box>
    );
  }

  return (
    <Box width="90%" margin="auto">
      <Text fontSize="2xl" mb="3" fontWeight="medium" px="4">
        Your Rooms
      </Text>
      {rooms.map((room) => (
        <DashBoardRoomCard room={room} key={Math.round(Math.random() * 1000)} />
      ))}
    </Box>
  );
};

export default DashBoardRooms;
