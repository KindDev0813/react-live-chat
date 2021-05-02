import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { ImEnter } from 'react-icons/im';
import { useHistory } from 'react-router';
//
import CreateRoomModel from '../components/dashboard/CreateRoomModel';
import DashBoardCard from '../components/dashboard/DashBoardCard';
import JoinRoomModel from '../components/dashboard/JoinRoomModel';
import { db } from '../firebase';
import { useAuth } from '../state/authState';

const DashBoard = () => {
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const history = useHistory();
  const authUser = useAuth((state) => state.authUser);
  const [roomIds, setRoomIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const userDoc = await db.collection('users').doc(authUser?.uid).get();
      const userData = userDoc.data();
      const roomIds = userData && userData.activeRooms;
      setRoomIds(roomIds);
    })();
  }, [authUser?.uid]);

  return (
    <Box p="5" pt="0">
      <Flex
        width="90%"
        margin="auto"
        p="3"
        justifyContent="space-between"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <DashBoardCard
          title="Create a room"
          icon={<FaPlus style={{ fontSize: '2em', color: 'teal' }} />}
          onOpen={onOpen1}
        />
        <CreateRoomModel isOpen={isOpen1} onClose={onClose1} />

        <DashBoardCard
          title="Join a room"
          icon={<ImEnter style={{ fontSize: '2em', color: 'teal' }} />}
          onOpen={onOpen2}
        />
        <JoinRoomModel isOpen={isOpen2} onClose={onClose2} />
      </Flex>

      <Box>
        {roomIds.map((id) => (
          <Text
            key={id}
            onClick={() => {
              history.push(`/room/${id}`);
            }}
          >
            {id}
          </Text>
        ))}
      </Box>
    </Box>
  );
};

export default DashBoard;
