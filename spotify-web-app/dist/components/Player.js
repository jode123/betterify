"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor() {
        this.isPlaying = false;
        this.currentTrackIndex = 0;
    }
    play() {
        this.isPlaying = true;
        console.log("Playing track:", this.currentTrackIndex);
        // Logic to play the current track
    }
    pause() {
        this.isPlaying = false;
        console.log("Paused track:", this.currentTrackIndex);
        // Logic to pause the current track
    }
    next(tracks) {
        if (this.currentTrackIndex < tracks.length - 1) {
            this.currentTrackIndex++;
            console.log("Next track:", this.currentTrackIndex);
            this.play();
        }
        else {
            console.log("No more tracks to play.");
        }
    }
}
exports.default = Player;
