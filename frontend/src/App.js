import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// تحميل المكونات
import Header from './components/Header';
import Footer from './components/Footer';

// تحميل الصفحات
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GuestLogin from './pages/GuestLogin';
import CreateSession from './pages/CreateSession';
import JoinSession from './pages/JoinSession';
import MySessions from './pages/MySessions';
import SessionDetails from './pages/SessionDetails';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/guest-login" element={<GuestLogin />} />
              <Route path="/create-session" element={<CreateSession />} />
              <Route path="/join-session" element={<JoinSession />} />
              <Route path="/my-sessions" element={<MySessions />} />
              <Route path="/session/:sessionId" element={<SessionDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;