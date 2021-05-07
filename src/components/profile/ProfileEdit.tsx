import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
// import { useHistory } from 'react-router';
import { auth, db } from '../../firebase';
import { AuthUser, useAuth } from '../../state/authState';

// interface ProfielEditProps {}

const ProfileEdit: React.FC = () => {
  const toast = useToast();
  // const history = useHistory();
  const authUser = useAuth((s) => s.authUser);
  const setAuthUser = useAuth((s) => s.setAuthUser);
  const [data, setData] = useState({ username: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const hardUsernameEdit = async (
    newAuthUser: AuthUser,
    oldUsername: string | null | undefined
  ) => {
    const dashRoomsDoc = await db
      .collection('dashrooms')
      .doc(authUser?.uid)
      .get();
    const dashRoomsData = dashRoomsDoc.data();
    if (!dashRoomsData) return; // toast here
    const keys = Object.keys(dashRoomsData);
    const values = Object.values(dashRoomsData);

    const newValues = values.map((item) => {
      let newObj: any = { ...item };
      if (item.admin === oldUsername) {
        newObj = { ...newObj, admin: newAuthUser.username };
      }
      //
      const oldRoomMates = item.roomMates;
      let newRoomMates: { uid: string; username: string }[] = [];
      newRoomMates = oldRoomMates.map(
        (mate: { uid: string; username: string }) => {
          if (mate.uid === newAuthUser.uid) {
            return {
              ...mate,
              username: newAuthUser.username,
            };
          } else {
            return mate;
          }
        }
      );
      newObj.roomMates = newRoomMates;
      //
      const oldBannedUsers = item.bannedUsers;
      let newBananedUsers: { uid: string; username: string }[] = [];
      newBananedUsers = oldBannedUsers.map(
        (user: { uid: string; username: string }) => {
          if (user.uid === newAuthUser.uid) {
            return {
              ...user,
              username: newAuthUser.username,
            };
          } else {
            return user;
          }
        }
      );
      newObj.bannedUsers = newBananedUsers;

      return newObj;
    });

    const newDashRooms: any = {};
    keys.forEach((key, i) => {
      newDashRooms[key] = newValues[i];
    });

    await db.collection('dashrooms').doc(newAuthUser.uid).set(newDashRooms);

    console.log(newDashRooms);
  };

  const handleUserProfileUpdate = async () => {
    console.log(data);
    if (data.username.trim() === '') {
      return setErrors({ username: 'Username cannot be emtpy' });
    }
    if (data.username.trim() === authUser?.username) {
      return setErrors({
        username: 'This is your current username, Try something different',
      });
    }

    // will edit the username in PROFILE, NAVBAR
    try {
      setLoading((l) => !l);
      const userDoc = await db
        .collection('users')
        .where('username', '==', data.username)
        .get();

      if (userDoc.size > 0) {
        setLoading((l) => !l);
        return setErrors({
          username: 'Username is taken, try something different',
        });
      }
      const user = auth.currentUser;
      await db
        .collection('users')
        .doc(authUser?.uid)
        .update({ username: data.username });

      // !
      const newUserDoc = db.collection('users').doc(authUser?.uid);
      const resUser = await newUserDoc.get();
      const newUserData = resUser.data();
      const newAuthUser: AuthUser = {
        uid: newUserData?.uid ?? 'undefined',
        username: newUserData?.username ?? 'undefined',
        email: newUserData?.email ?? 'undefined',
        activeRooms: newUserData?.activeRooms ?? 'undefined',
      };
      setAuthUser(newAuthUser);
      hardUsernameEdit(newAuthUser, user?.displayName);
      await user?.updateProfile({ displayName: data.username });
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
    }
    // will edit username in room, dashrooms, roomMessages;
    toast({
      title: 'Updating username in rooms takes some time',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    setLoading((l) => !l);
  };

  return (
    <>
      <Box w="80%" mx="auto">
        <Text fontSize="3xl">Update Profile</Text>
        <FormControl
          id="username"
          my="2"
          isRequired
          isInvalid={errors.username ? true : false}
          mt="6"
        >
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            name="username"
            value={data.username}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="teal"
          onClick={handleUserProfileUpdate}
          isLoading={loading}
          loadingText="Updating..."
        >
          Update
        </Button>
      </Box>
    </>
  );
};

export default ProfileEdit;
