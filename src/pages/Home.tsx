import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../state/authState';

const Home = () => {
  const history = useHistory();
  const authUser = useAuth((state) => state.authUser);

  useEffect(() => {
    if (authUser) history.push('/dashboard');
  }, [history, authUser]);

  return <div>this is Home page</div>;
};

export default Home;
