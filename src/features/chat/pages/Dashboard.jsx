import React from 'react';
import {useSelector} from "react-redux";

const Dashboard = () => {
  const {user} = useSelector(state => state.auth.user);
  return (
    <div>
      
    </div>
  )
}

export default Dashboard
