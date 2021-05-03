import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex } from '@chakra-ui/layout';
import { FaPlus } from 'react-icons/fa';
import { ImEnter } from 'react-icons/im';
//
import CreateRoomModel from '../components/dashboard/CreateRoomModel';
import DashBoardCard from '../components/dashboard/DashBoardCard';
import DashBoardRooms from '../components/dashboard/DashBoardRooms';
import JoinRoomModel from '../components/dashboard/JoinRoomModel';

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

      <DashBoardRooms />
    </Box>
  );
};

export default DashBoard;
