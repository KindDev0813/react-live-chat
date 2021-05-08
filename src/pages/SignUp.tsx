import React, { useEffect, useState } from 'react';
import { Button, IconButton } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import { validateInputs } from '../utils/validators';
import { auth, db } from '../firebase';
import { useAuth } from '../state/authState';
import { useToast } from '@chakra-ui/toast';
import { Link, useHistory } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface SignUpError {
  username?: string;
  email?: string;
  password?: string;
}

const SignUp = () => {
  const toast = useToast();
  const history = useHistory();

  const [data, setData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState<SignUpError>({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const signup = useAuth((state) => state.signup);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) history.push('/dashboard');
  }, [history]);

  const handleClick = () => setShow(!show);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    const validationErrors = validateInputs(data);
    if (Object.keys(validationErrors).length > 0)
      return setErrors(validationErrors);

    try {
      setErrors({});
      setLoading(true);
      const qs = await db
        .collection('users')
        .where('username', '==', data.username)
        .limit(1)
        .get();

      if (!qs.empty) {
        setLoading(false);
        return setErrors({ ...errors, username: 'Username is taken' });
      }

      const { user } = await signup(data.email, data.password);
      if (!user) return;
      user.updateProfile({ displayName: data.username });

      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: data.email,
        username: data.username,
        profileImgUrl: '',
        profileImgFileName: '',
      });

      toast({
        title: 'Account created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      history.push('/dashboard');
      //
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
      console.log('error in SignUp.tsx');
      if (err.code === 'auth/email-already-in-use')
        setErrors({ ...errors, email: err.message });
    }
    setLoading(false);
  };

  return (
    <>
      <Box
        w={{ base: '100%', md: '40%' }}
        border="1px"
        margin="auto"
        borderColor="gray.300"
        borderRadius="xl"
        py="0"
        px="5"
        pb="4"
        pt="2"
        style={{ marginTop: '2rem' }}
      >
        <Text
          fontSize="4xl"
          color="teal.600"
          fontWeight="bold"
          textAlign="center"
        >
          SignUp
        </Text>

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

        <FormControl
          id="email"
          my="2"
          isRequired
          isInvalid={errors.email ? true : false}
        >
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl
          id="password"
          my="2"
          isRequired
          isInvalid={errors.password ? true : false}
        >
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? 'text' : 'password'}
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            <InputRightElement>
              <IconButton
                bg="transparent !important"
                variant="ghost"
                aria-label={show ? 'Mask password' : 'Reveal password'}
                icon={show ? <FiEyeOff /> : <FiEye />}
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="teal"
          onClick={handleSignUp}
          isLoading={loading}
          loadingText="Submiting.."
          my="3"
        >
          Submit
        </Button>
      </Box>
      <Box textAlign="center" mt="3">
        <Text>
          Already have an account?{' '}
          <Button colorScheme="teal" variant="link" as={Link} to="/login">
            Log in here
          </Button>
        </Text>
      </Box>
    </>
  );
};

export default SignUp;
