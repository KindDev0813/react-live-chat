import { Image } from '@chakra-ui/image';
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
        let rooms = Object.values({ ...qsData });
        rooms.reverse();
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
      {rooms.length === 0 && (
        <Box px="4">
          <Text fontSize="7xl" textAlign="center" textColor="darkslategray">
            No rooms found
          </Text>
          <Box boxSize="30%">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/react-room-chat.appspot.com/o/noroomfound.jpg?alt=media&token=57ca4942-9c88-404d-aa5a-cd744cdd8cc2"
              alt="no room found"
            />
          </Box>
        </Box>
      )}
      {rooms.length !== 0 && (
        <>
          <Text fontSize="2xl" mb="3" fontWeight="medium" px="4">
            Your Rooms
          </Text>
          {rooms.map((room) => (
            <DashBoardRoomCard
              room={room}
              key={Math.round(Math.random() * 1000)}
            />
          ))}
        </>
      )}
    </Box>
  );
};

export default DashBoardRooms;
