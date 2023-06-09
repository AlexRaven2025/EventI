import {Routes, Route} from 'react-router-dom'
import {Home} from './componets/home.js';
import { NavBar } from './componets/NavBar.js';
import './index.css'
import LoginForm from './componets/loginform.js';

function App() {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='login' element={<LoginForm/>} />
    </Routes>
    </>
  );
}

export default App;
