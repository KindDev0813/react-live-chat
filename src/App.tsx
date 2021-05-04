import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ChakraProvider, Container } from '@chakra-ui/react';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import DashBoard from './pages/DashBoard';
import { auth, db } from './firebase';
import { useAuth, AuthUser } from './state/authState';
import Room from './pages/Room';

const App: React.FC = () => {
  const loading = useAuth((state) => state.loading);
  const setAuthUser = useAuth((state) => state.setAuthUser);
  const setLoading = useAuth((state) => state.setLoading);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        (async () => {
          try {
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
              const user = doc.data();
              const authUser: AuthUser = {
                uid: user?.uid ?? 'undefined',
                username: user?.username ?? 'undefined',
                email: user?.email ?? 'undefined',
                activeRooms: user?.activeRooms ?? 'undefined',
              };
              setAuthUser(authUser);
            } else {
              setAuthUser(null);
            }
            setLoading(false);
          } catch (e) {
            console.log(e.code);
            console.log(e.message);
          }
        })();
      } else {
        setAuthUser(null);
        setLoading(false);
      }
    });
    return () => {
      unsub();
    };
  }, [setAuthUser, setLoading]);

  return (
    <ChakraProvider>
      {!loading && (
        <>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Container maxW="container.xl" pt="2">
              <Route path="/signup" component={SignUp} />
              <Route path="/login" exact component={Login} />
              <Route path="/dashboard" component={DashBoard} />
              <Route path="/room/:roomId" component={Room} />
            </Container>
          </Switch>
        </>
      )}
    </ChakraProvider>
  );
};

export default App;
