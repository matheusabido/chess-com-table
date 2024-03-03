import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Table from './pages/Table';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Index /> } />
        <Route path="/table" element={ <Table /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
