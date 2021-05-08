import { Button } from '@chakra-ui/button';
import { BsFilePlus } from 'react-icons/bs';
import { Box, Text } from '@chakra-ui/layout';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useState } from 'react';
import ProgressBar from '../ProgressBar';
import { db, storage } from '../../firebase';
import { useAuth } from '../../state/authState';

const types = ['image/png', 'image/jpeg'];

const ProfileImageUpload = ({
  uid,
  profileImgFileName,
}: {
  uid: string | undefined;
  profileImgFileName: string | undefined;
}) => {
  const [file, setFile] = useState<null | File>(null);
  const [error, setError] = useState<null | string>(null);
  const authUser = useAuth((s) => s.authUser);
  const setAuthUser = useAuth((s) => s.setAuthUser);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return setError('No iamge is selected');
    }
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a image file (png or jpeg)');
    }
  };

  const handleImageDelete = async () => {
    await storage.ref(profileImgFileName).delete();
    await db.collection('users').doc(authUser?.uid).update({
      profileImgUrl: '',
      profileImgFileName: '',
    });
    const newAuthUser: any = {
      ...authUser,
      profileImgUrl: '',
      profileImgFileName: '',
    };
    setAuthUser(newAuthUser);
  };

  return (
    <Box>
      <FormControl mb="1">
        <FormLabel>Profile Image</FormLabel>
        <Button
          as="label"
          variant="outline"
          colorScheme="teal"
          rightIcon={<BsFilePlus size={20} />}
          htmlFor="image-upload"
          cursor="pointer"
        >
          Add
        </Button>
        <input
          id="image-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={changeHandler}
        />
        <Button
          ml="3"
          variant="ghost"
          colorScheme="red"
          onClick={handleImageDelete}
        >
          Remove
        </Button>
      </FormControl>
      <Box>
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
        {file && <ProgressBar file={file} setFile={setFile} uid={uid} />}
      </Box>
    </Box>
  );
};

export default ProfileImageUpload;
