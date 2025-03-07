import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Auth from './components/Auth';
import Playlist from './components/Playlist';
import Player from './components/Player';

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Auth} />
          <Route path="/playlists" component={Playlist} />
          <Route path="/player" component={Player} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;