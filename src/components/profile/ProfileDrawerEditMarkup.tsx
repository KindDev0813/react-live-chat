import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { DrawerBody, DrawerFooter } from '@chakra-ui/modal';
import { useState } from 'react';
import { auth, db } from '../../firebase';
import { useAuth } from '../../state/authState';

interface ProfileDrawerEditMarkupProps {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileDrawerEditMarkup: React.FC<ProfileDrawerEditMarkupProps> = ({
  setEdit,
}) => {
  const authUser = useAuth((s) => s.authUser);
  const [data, setData] = useState({ username: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
      setEdit(false);
    } catch (err) {}
    setLoading((l) => !l);
  };

  return (
    <>
      <DrawerBody>
        <FormControl
          id="username"
          my="2"
          isRequired
          isInvalid={errors.username ? true : false}
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
      </DrawerBody>
      <DrawerFooter>
        <Button
          variant="outline"
          mr={3}
          onClick={() => {
            setEdit(false);
          }}
        >
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleUserProfileUpdate}
          isLoading={loading}
          loadingText="Updaing..."
        >
          Update
        </Button>
      </DrawerFooter>
    </>
  );
};

export default ProfileDrawerEditMarkup;
