import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Import the Login component
import Home from './components/Home'; // Import the Home component


const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} /> {/* Render Login component for '/' path */}
      <Route path="/home" element={<Home />} /> {/* Render Home component for '/home' path */}
    </Routes>
  </BrowserRouter>
);

export default App;