import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const Public = ({children}) => {

  const user = useSelector(state => state.auth.user);
  const initialized = useSelector(state => state.auth.initialized);

  if(!initialized) {
    return <div>Loading...</div>
  }

  if(user) {
    return <Navigate to="/" replace></Navigate>
  }

  return children;
}

export default Public
