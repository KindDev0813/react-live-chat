import { Box, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import ProfileEdit from '../components/profile/ProfileEdit';
import ProfileRoomStatCard from '../components/profile/ProfileRoomStatCard';
import ProfileUsername from '../components/profile/ProfileUsername';
import ProfileImage from '../components/ProfileImage';
import { db } from '../firebase';
import { useAuth } from '../state/authState';

const Profile = () => {
  const authUser = useAuth((s) => s.authUser);
  const [data, setData] = useState<
    | {
        createdRooms: number;
        activeRooms: number;
      }
    | undefined
  >();

  useEffect(() => {
    (async () => {
      const doc = await db.collection('dashrooms').doc(authUser?.uid).get();
      const state: any = {};
      const qsData = doc.data();
      const rooms = Object.values({ ...qsData });
      state.activeRooms = rooms.length;
      state.createdRooms = rooms.reduce((acc, curr) => {
        if (curr.admin === authUser?.username) return (acc += 1);
        else return acc;
      }, 0);
      setData(state);
    })();
  }, [authUser]);

  if (!data) return <></>;

  return (
    <Box w="90%" mx="auto" p="4" d="flex" justifyContent="space-around">
      <Box w="40%">
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
            overflow="hidden"
            borderRadius="full"
          >
            <ProfileImage url={authUser?.profileImgUrl} />
          </Box>
          <ProfileUsername username={authUser?.username} />
          <Text>{authUser?.email}</Text>
          <Box
            w="100%"
            d="flex"
            alignItems="center"
            justifyContent="space-between"
            mt="4"
            h="36"
          >
            <ProfileRoomStatCard text="Rooms Active" count={data.activeRooms} />
            <ProfileRoomStatCard
              text="Rooms Created"
              count={data.createdRooms}
            />
          </Box>
        </Box>
      </Box>
      <Box w="60%">
        <ProfileEdit />
      </Box>
    </Box>
  );
};

export default Profile;
