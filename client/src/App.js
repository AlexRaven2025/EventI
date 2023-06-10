import {Routes, Route} from 'react-router-dom'
import { useLocation } from 'react-router'; // Update this line
import {Home} from './componets/home.js';
import { NavBar } from './componets/NavBar.js';
import {LoginForm} from './componets/loginform.js';
import {SignUp} from './componets/sign_up.js';

function App() {
  const location = useLocation();
  const hideNavBar = location.pathname === '/signup';
  return (
    <>
    {!hideNavBar && <NavBar/>}
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='login' element={<LoginForm/>} />
      <Route path='SignUp' element={<SignUp/>} />
    </Routes>
    </>
  );
}

export default App;
