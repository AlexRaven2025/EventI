import {Routes, Route, useLocation} from 'react-router-dom'
import {Home} from './componets/home.js';
import { NavBar } from './componets/NavBar.js';
import {LoginForm} from './componets/loginform.js';
import {SignUp} from './componets/sign_up.js';
import {Events} from './componets/events.js';
import {Profile} from './componets/profile.js';
import {EventCreateForm} from './componets/EventCreateForm.js';

function App() {
  const location = useLocation();
  const hideNavBar = location.pathname === '/signup';
  return (
    <>
    {!hideNavBar && <NavBar/>}
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='login' element={<LoginForm/>} />
      <Route path='SignUp' element={<SignUp  />} />
      <Route path='Events'  element={<Events/>} />
      <Route path='Profile' element={<Profile/>} />
      <Route path='EventCreateForm' element={< EventCreateForm />} />
    </Routes>
    </>
  );
}

export default App;
