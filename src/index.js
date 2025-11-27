import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import AvatarCustomize from './pages/AvatarCustomize';
import Stats from './pages/Stats';
import Adventure from './pages/Adventure';
import AdventureGame from './pages/AdventureGame';
import EndlessMode from './pages/EndlessMode';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path="game" element={<Game />} />
          <Route path="avatarCustomize" element={<AvatarCustomize />} />
          <Route path="stats" element={<Stats />} />
          <Route path="adventure" element={<Adventure />} />
          <Route path="adventureGame" element={<AdventureGame />} />
          <Route path="endlessMode" element={<EndlessMode />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
