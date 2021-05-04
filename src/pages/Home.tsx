import { Button } from '@chakra-ui/button';
import { Box, Text } from '@chakra-ui/layout';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const Home = () => {
  const history = useHistory();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) history.push('/dashboard');
  }, [history]);

  return (
    <Box maxH="100vh">
      <Text
        textAlign="center"
        fontSize="8xl"
        color="darkslategrey"
        maxWidth="75%"
        margin="auto"
      >
        A simple Realtime Chat Application{' '}
      </Text>
      <Text textAlign="center" fontSize="xl" mb="10" mt="8">
        developed using and Chakra UI{' '}
        <Button colorScheme="teal" variant="link" fontSize="xl">
          <a href="https://www.google.com" target="_blank" rel="noreferrer">
            React
          </a>
        </Button>
        ,{' '}
        <Button colorScheme="teal" variant="link" fontSize="xl">
          <a
            href="https://firebase.google.com/"
            target="_blank"
            rel="noreferrer"
          >
            Firebase
          </a>
        </Button>
        ,{' '}
        <Button colorScheme="teal" variant="link" fontSize="xl">
          <a
            href="https://github.com/pmndrs/zustand"
            target="_blank"
            rel="noreferrer"
          >
            Zustand
          </a>
        </Button>{' '}
        and{' '}
        <Button colorScheme="teal" variant="link" fontSize="xl">
          <a href="https://chakra-ui.com/" target="_blank" rel="noreferrer">
            Chakra UI
          </a>
        </Button>
      </Text>
      <Box textAlign="center">
        <Button to="/login" colorScheme="teal" as={Link}>
          Login To Kickstart
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
