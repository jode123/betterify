import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PlaylistView from './components/PlaylistView';
import AuthGuard from './components/AuthGuard';
import Login from './components/Login';
import Callback from './components/Callback';

class Player extends React.Component {
  render() {
    return (
      <div className="player">
        {/* Player content */}
      </div>
    );
  }
}

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={
              <AuthGuard>
                <PlaylistView />
              </AuthGuard>
            } />
            <Route path="/callback" element={<Callback />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<div>404 - Not Found</div>} />
          </Routes>
        </Suspense>
      </main>
      <Player />
    </div>
  );
};

export default App;