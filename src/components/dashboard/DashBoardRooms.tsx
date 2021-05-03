import { Box, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { RoomType } from '../../pages/Room';
import { useAuth } from '../../state/authState';
import DashBoardRoomCard from './DashBoardRoomCard';

const DashBoardRooms = () => {
  const authUser = useAuth((state) => state.authUser);
  const [rooms, setRooms] = useState<RoomType[] | null>();

  // useEffect(() => {
  //   const getUesrRooms = async () => {
  //     const roomIds = authUser?.activeRooms;
  //     const rooms: RoomType[] = [];
  //     await roomIds!.reduce(async (promise, file) => {
  //       await promise;
  //       const roomDoc = await db.collection('rooms').doc(file).get();
  //       const roomData = roomDoc.data();
  //       if (!roomData) {
  //         console.log('room data doesnot exitst');
  //         return;
  //       }
  //       const room: RoomType = {
  //         admin: roomData.admin,
  //         roomId: roomData.roomId,
  //         roomName: roomData.roomName,
  //         roomMates: roomData.roomMates,
  //       };
  //       rooms.push(room);
  //     }, Promise.resolve());
  //     setRooms(rooms);
  //   };
  //   getUesrRooms();
  // }, [authUser?.uid, authUser?.activeRooms]);

  useEffect(() => {
    db.collection('dashrooms')
      .doc(authUser?.uid)
      .onSnapshot((qs) => {
        const qsData = qs.data();
        const rooms = Object.values({ ...qsData });
        setRooms(rooms);
      });
  }, [authUser?.uid]);

  if (!rooms) return <h1>Loading..</h1>;

  return (
    <Box>
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
