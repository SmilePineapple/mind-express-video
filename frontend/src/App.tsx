import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { CallPage } from './components/CallPage';
import { BrowserDetection } from './components/BrowserDetection';
import './App.css';

function App() {
  return (
    <>
      <BrowserDetection />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/room/:licenseId" element={<CallPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
