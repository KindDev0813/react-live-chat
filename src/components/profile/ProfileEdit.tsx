import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import firebase from 'firebase/app';
import { auth, db } from '../../firebase';
import { AuthUser, useAuth } from '../../state/authState';
import ProfileImageUpload from './ProfileImageUpload';

const ProfileEdit: React.FC = () => {
  const toast = useToast();
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
    try {
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
        return newObj;
      });

      const newDashRooms: any = {};
      keys.forEach((key, i) => {
        newDashRooms[key] = newValues[i];
      });

      await db.collection('dashrooms').doc(newAuthUser.uid).set(newDashRooms);
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
    }
    try {
      const roomIds = newAuthUser.activeRooms;
      await roomIds.reduce(async (promise: any, roomId: string) => {
        await promise;
        const roomRef = db.collection('rooms').doc(roomId);
        const roomDoc = await roomRef.get();
        const roomData = roomDoc.data();
        if (!roomData) return; // toast here
        if (roomData.admin === oldUsername) {
          await roomRef.update({ admin: newAuthUser.username });
        }
        const oldRoomMates = roomData.roomMates;
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
        await roomRef.update({
          roomMates: newRoomMates,
        });
        //
        const oldBannedUsers = roomData.bannedUsers;
        let newBannedUsers: { uid: string; username: string }[] = [];
        newBannedUsers = oldBannedUsers.map(
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
        await roomRef.update({
          bannedUsers: newBannedUsers,
        });
      }, Promise.resolve());
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
    }

    try {
      const roomIds = newAuthUser.activeRooms;
      await roomIds.reduce(async (promise: any, roomId: string) => {
        await promise;
        const messagesDocs = await db
          .collection('roomMessages')
          .doc(roomId)
          .collection('messages')
          .where('sender', '==', oldUsername)
          .get();

        await messagesDocs.docs.reduce(
          async (
            promise: any,
            doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
          ) => {
            await promise;
            await doc.ref.update({ sender: newAuthUser.username });
          },
          Promise.resolve()
        );
      }, Promise.resolve());
    } catch (err) {}
  };

  const handleUserProfileUpdate = async () => {
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
        profileImgUrl: newUserData?.profileImgUrl ?? 'undefind',
        profileImgFileName: newUserData?.profileImgFileName ?? 'undefined',
      };
      hardUsernameEdit(newAuthUser, user?.displayName);
      await user?.updateProfile({ displayName: data.username });
      setAuthUser(newAuthUser);
      setLoading((l) => !l);
      setData({ username: '' });
      toast({
        title: 'Username updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
    }
  };

  return (
    <>
      <Box w="80%" mx="auto">
        <Text fontSize="3xl" textAlign="center">
          Update Profile
        </Text>
        <FormControl
          id="username"
          isRequired
          isInvalid={errors.username ? true : false}
          mt="6"
          mb="3"
        >
          <FormLabel>Username</FormLabel>
          <InputGroup size="md">
            <Input
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
            />
            <InputRightElement w="fit-content">
              <Button
                mr="2"
                size="xs"
                colorScheme="teal"
                onClick={handleUserProfileUpdate}
                isLoading={loading}
                loadingText="Updating..."
              >
                Update
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>

        <ProfileImageUpload uid={authUser?.uid} />
      </Box>
    </>
  );
};

export default ProfileEdit;
