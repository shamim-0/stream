import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/auth/Login';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './Components/auth/ProtectedRoute';
import Dashboard from './Components/Dashboard/Dashboard';
import Home from './Components/Dashboard/Home';
import AddStream from './Components/Dashboard/AddStream';
import FolderList from './Components/Dashboard/FolderList';
import Category from './Components/Dashboard/Category';
import Stream from './Components/Dashboard/Stream';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>

        }
        >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/add-stream" element={<AddStream />} />
          <Route path="/dashboard/list-flder" element={<FolderList />} />
          <Route path="/dashboard/stream-category" element={<Category />} />
          <Route path="/dashboard/list-flder/:folder" element={<Stream />} />
        </Route>

      </Routes>
      <Toaster />
    </BrowserRouter>

  );
}

export default App;
