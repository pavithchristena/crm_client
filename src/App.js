import React from 'react'
import Salespipeline from './components/Salespipeline';
import ManagePipeline from './components/ManagePipeline';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from 'styled-components';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ManagePipeline />} />
          <Route path='/salespipeline' element={<Salespipeline />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
