import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { CallPageMesh } from './components/CallPageMesh';
import { BrowserDetection } from './components/BrowserDetection';
import './App.css';

function App() {
  return (
    <>
      <BrowserDetection />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/room/:licenseId" element={<CallPageMesh />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
