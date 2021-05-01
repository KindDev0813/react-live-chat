import React from 'react';
import { useAuth } from '../state/authState';

const DashBoard = () => {
  const authUser = useAuth((state) => state.authUser);
  return <div>Welcome {authUser?.username}</div>;
};

export default DashBoard;
