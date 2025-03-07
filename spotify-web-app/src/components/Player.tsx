import React from 'react';

class Player extends React.Component {
  render() {
    return (
      <div className="player">
        {
        <div className="player-controls">
          <button>Previous</button>
          <button>Play/Pause</button>
          <button>Next</button>
        </div>
  }
      </div>
    );
  }
}

export default Player;