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

const App: React.FC = () => {
  const loading = useAuth((state) => state.loading);
  const authUser = useAuth((state) => state.authUser);
  const fbUser = useAuth((state) => state.fbUser);
  const setFbUser = useAuth((state) => state.setFbUser);
  const setAuthUser = useAuth((state) => state.setAuthUser);
  const setLoading = useAuth((state) => state.setLoading);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) setFbUser({ uid: user.uid });
      else setFbUser(null);
    });
    return () => {
      unsub();
    };
  }, [setFbUser]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const doc = await db.collection('users').doc(fbUser?.uid).get();
        if (doc.exists) {
          const user = doc.data();
          const authUser: AuthUser = {
            uid: user?.uid ?? 'undefined',
            username: user?.username ?? 'undefined',
            email: user?.email ?? 'undefined',
          };
          setAuthUser(authUser);
        } else {
          setAuthUser(null);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        console.log(e.code);
        console.log(e.message);
      }
    }
    fetchUser();
  }, [fbUser, setAuthUser, setLoading]);

  console.log(authUser);

  return (
    <ChakraProvider>
      {!loading && (
        <>
          <Navbar />
          <Switch>
            <Container maxW="container.xl" pt="2">
              <Route path="/" exact component={Home} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <Route path="/dashboard" component={DashBoard} />
            </Container>
          </Switch>
        </>
      )}
    </ChakraProvider>
  );
};

export default App;
