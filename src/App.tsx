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
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  const loading = useAuth((state) => state.loading);
  const authUser = useAuth((state) => state.authUser);
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
              <PrivateRoute
                path="/dashboard"
                component={DashBoard}
                isAuthenticated={authUser ? true : false}
                authenticationPath="/login"
              />
            </Container>
          </Switch>
        </>
      )}
    </ChakraProvider>
  );
};

export default App;
