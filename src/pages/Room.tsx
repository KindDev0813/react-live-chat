import { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import { useHistory, useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/toast';

import RoomLeft from '../components/room/RoomLeft';
import { db } from '../firebase';
import RoomRight from '../components/room/RoomRight';
import { useAuth } from '../state/authState';

export interface RoomType {
  admin: string;
  roomId: string;
  roomName: string;
  roomMates: { uid: string; username: string }[];
}

const Room = () => {
  const toast = useToast();
  const params: any = useParams();
  const history = useHistory();
  const authUser = useAuth((state) => state.authUser);
  const [room, setRoom] = useState<RoomType | null>(null);

  useEffect(() => {
    if (!authUser) return history.push('/');
    const fetchRoom = async () => {
      const unsub = db
        .collection('rooms')
        .doc(params.roomId)
        .onSnapshot((qs) => {
          if (qs.exists) {
            const roomData = qs.data();
            const isUserThere = roomData?.roomMates
              .map((user: any) => user.uid)
              .includes(authUser?.uid);
            if (!isUserThere) {
              history.push('/dashboard');
            }
            const room: RoomType = {
              admin: roomData?.admin,
              roomId: roomData?.roomId,
              roomName: roomData?.roomName,
              roomMates: roomData?.roomMates,
            };
            setRoom(room);
          } else {
            history.push('/dashboard');
          }
        });
      return unsub;
    };
    fetchRoom();
  }, [params.roomId, history, authUser?.uid, toast, authUser]);

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
        <RoomRight room={room} />
      </Flex>
    </Box>
  );
};

export default Room;
