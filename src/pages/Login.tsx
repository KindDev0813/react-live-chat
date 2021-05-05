import React, { useEffect, useState } from 'react';
import { Button, IconButton } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { Box, Text } from '@chakra-ui/layout';
import { useAuth } from '../state/authState';
import { Link, useHistory } from 'react-router-dom';
import { useToast } from '@chakra-ui/toast';
import { auth } from '../firebase';

interface LoginError {
  email?: string;
  password?: string;
}

const Login = () => {
  const toast = useToast();
  const history = useHistory();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginError>({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const login = useAuth((state) => state.login);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) history.push('/dashboard');
    });
    return () => unsub();
  }, [history]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleLogin = async () => {
    let validationErrors: LoginError = {};
    if (data.email.trim() === '')
      validationErrors.email = 'Email cannot be empty';
    if (data.password.trim() === '')
      validationErrors.password = 'Password cannot be empty';
    if (Object.keys(validationErrors).length > 0)
      return setErrors(validationErrors);

    try {
      setLoading(true);
      await login(data.email, data.password);
      toast({
        title: 'Logged In',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
      console.log('failed to login');
      if (err.code === 'auth/user-not-found') {
        toast({
          title: 'User not found',
          description: 'Signup to create an account',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      if (
        err.code === 'auth/invalid-email' ||
        err.code === 'auth/wrong-password'
      )
        setErrors({
          ...errors,
          email: 'Invalid credentials',
          password: 'Invalid credentials',
        });
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
          LogIn
        </Text>

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
          onClick={handleLogin}
          isLoading={loading}
          loadingText="Submiting.."
          my="3"
        >
          Submit
        </Button>
      </Box>
      <Box textAlign="center" mt="3">
        <Text>
          Don't have an account?{' '}
          <Button colorScheme="teal" variant="link" as={Link} to="/signup">
            SignUp here
          </Button>
        </Text>
      </Box>
    </>
  );
};

export default Login;
