import { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import { useParams } from 'react-router-dom';

import RoomLeft from '../components/room/RoomLeft';
import { db } from '../firebase';

interface RoomType {
  admin: string;
  roomId: string;
  roomName: string;
  roomMates: { uid: string; username: string }[];
}

const Room = () => {
  const params: any = useParams();
  const [room, setRoom] = useState<RoomType | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const roomDoc = await db.collection('rooms').doc(params.roomId).get();
      if (roomDoc.exists) {
        const roomData = roomDoc.data();
        const room: RoomType = {
          admin: roomData?.admin,
          roomId: roomData?.roomId,
          roomName: roomData?.roomName,
          roomMates: roomData?.roomMates,
        };
        setRoom(room);
      }
    };
    fetchRoom();
  }, [params.roomId]);

  if (!room) return <h1>Loading...</h1>;

  return (
    <Box h="90vh" display="flex" alignItems="center">
      <Flex
        width="90%"
        m="auto"
        height="97%"
        border="1px"
        borderRadius="3px"
        borderColor="blackAlpha.200"
      >
        <RoomLeft roomMates={room.roomMates} />
      </Flex>
    </Box>
  );
};

export default Room;
