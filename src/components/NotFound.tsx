import { Box, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const NotFound = () => {
  const history = useHistory();

  const [time, setTime] = useState(5);
  useEffect(() => {
    setInterval(() => {
      setTime((time) => time - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (time === 0) {
      history.push('/');
    }
  }, [time, history]);

  return (
    <Box textAlign="center">
      <Text fontSize="9xl" color="darkslategrey">
        404 | Page not found
      </Text>
      <Text fontSize="2xl" mt="5">
        Redirecting in {time} seconds...
      </Text>
    </Box>
  );
};

export default NotFound;
