import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NormalUser from './pages/NormalUser';
import {BrowserRouter as Router , Route, Routes} from 'react-router-dom'
import NUserRegistartion from './pages/NUserRegistartion';
import Storeownerlanding from './components/Storeowner_landing';
function App() {
  return (

    <>
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/user' element={<NormalUser/>}></Route>
        <Route path='/register' element={<NUserRegistartion/>}/>
        <Route path='/storeOwner' element={<Storeownerlanding/>}/>

      </Routes>
    </Router>
      
    </>
  );
}

export default App;
