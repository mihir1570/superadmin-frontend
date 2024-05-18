import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Addadmin from "./components/Addadmin";
import Newpassword from './components/Newpassword';
import Setforgotpassword from './components/Setforgotpassword';



function App() {
  return (
    <>
     <BrowserRouter>
     <Routes>
     <Route path='/' element={<Login />}></Route>
      <Route path='/dashboard' element={<Dashboard />}></Route>
      <Route path='/analytics' element={<Analytics />}></Route>
      <Route path='/addadmin' element={<Addadmin />}></Route>
      <Route path='/newpassword/:email' element={<Newpassword />}></Route>
      <Route path='/setforgotpassword/:email' element={<Setforgotpassword />}></Route>
     </Routes>
     </BrowserRouter>
    </>
  );
}

export default App;
