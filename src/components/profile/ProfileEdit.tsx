import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { auth, db } from '../../firebase';
import { useAuth } from '../../state/authState';

interface ProfielEditProps {}

const ProfileEdit: React.FC<ProfielEditProps> = () => {
  const history = useHistory();
  const authUser = useAuth((s) => s.authUser);
  const setAuthUser = useAuth((s) => s.setAuthUser);
  const [data, setData] = useState({ username: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  console.log(authUser);

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
      await user?.updateProfile({ displayName: data.username });
      await db
        .collection('users')
        .doc(authUser?.uid)
        .update({ username: data.username });

      setAuthUser({
        activeRooms: ['asdf'],
        email: 'asdf.asdf',
        uid: 'asedgase',
        username: 'asdfasdg',
      });
      history.push('/');
    } catch (err) {}
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
