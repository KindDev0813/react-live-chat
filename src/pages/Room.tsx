import { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import { useHistory, useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/toast';

import RoomLeft from '../components/room/RoomLeft';
import { auth, db } from '../firebase';
import RoomRight from '../components/room/RoomRight';
import { useAuth } from '../state/authState';
import { Skeleton } from '@chakra-ui/skeleton';

export interface RoomType {
  admin: string;
  roomId: string;
  roomName: string;
  roomMates: { uid: string; username: string }[];
  bannedUsers: { uid: string; username: string }[];
}

const Room = () => {
  const toast = useToast();
  const params: any = useParams();
  const history = useHistory();
  const authUser = useAuth((state) => state.authUser);
  const [room, setRoom] = useState<RoomType | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return history.push('/');
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
              bannedUsers: roomData?.roomMates,
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

  if (!room) {
    return (
      <Box h="90vh" display="flex" width="90%" mx="auto">
        <Skeleton
          height="100%"
          width="28%"
          startColor="gray.100"
          endColor="gray.300"
        />
        <Skeleton
          height="100%"
          width="70%"
          marginLeft="auto"
          startColor="gray.100"
          endColor="gray.300"
        />
      </Box>
    );
  }

  return (
    <Box h="90vh" display="flex" alignItems="center">
      <Flex
        width="90%"
        m="auto"
        height="97%"
        border="1px"
        borderRadius="md"
        borderColor="blackAlpha.300"
        shadow="lg"
      >
        <RoomLeft roomMates={room.roomMates} roomAdmin={room.admin} />
        <RoomRight room={room} />
      </Flex>
    </Box>
  );
};

export default Room;
