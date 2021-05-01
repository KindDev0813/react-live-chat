import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { useAuth } from '../state/authState';

const Navbar = () => {
  const logout = useAuth((state) => state.logout);
  const handleLogout = () => logout();

  return (
    <Box py="1" shadow="md">
      <Box
        w="90%"
        h="100%"
        m="auto"
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="teal.700"
          as={Link}
          to="/"
        >
          LOGO
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <>
            <Button
              onClick={handleLogout}
              fontWeight="normal"
              colorScheme="gray"
              variant="ghost"
            >
              LogOut
            </Button>
            <Button
              as={Link}
              fontWeight="normal"
              to="/login"
              colorScheme="gray"
              variant="ghost"
            >
              Login
            </Button>
            <Button
              as={Link}
              fontWeight="normal"
              to="/signup"
              colorScheme="gray"
              variant="ghost"
            >
              SignUp
            </Button>
          </>
        </Stack>
      </Box>
    </Box>
  );
};

export default Navbar;
