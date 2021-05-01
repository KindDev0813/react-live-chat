import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ChakraProvider, Container } from '@chakra-ui/react';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Navbar />
      <Switch>
        <Container maxW="container.xl" pt="2">
          <Route path="/" exact component={Home} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
        </Container>
      </Switch>
    </ChakraProvider>
  );
};

export default App;
