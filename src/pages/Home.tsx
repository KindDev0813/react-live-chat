import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { auth } from '../firebase';

const Home = () => {
  const history = useHistory();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) history.push('/dashboard');
  }, [history]);

  return <div>this is Home page</div>;
};

export default Home;
