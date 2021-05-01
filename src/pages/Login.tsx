import React, { useState } from 'react';
import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import { useAuth } from '../state/authState';
import { useHistory } from 'react-router-dom';
import { useToast } from '@chakra-ui/toast';

interface LoginError {
  email?: string;
  password?: string;
}

const Login = () => {
  const toast = useToast();
  const history = useHistory();
  const [data, setData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginError>({});
  const [loading, setLoading] = useState(false);
  const login = useAuth((state) => state.login);

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
      history.push('/dashboard');
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
      if (err.code === 'auth/wrong-password')
        setErrors({ ...errors, password: 'Incorrect password' });
    }
    setLoading(false);
  };
  return (
    <Box
      w={{ base: '100%', md: '40%' }}
      border="1px"
      margin="auto"
      borderColor="gray.300"
      borderRadius="xl"
      shadow="lg"
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
        <Input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
        />
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
  );
};

export default Login;
