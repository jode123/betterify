"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlaylistCard {
    constructor(title, image) {
        this.title = title;
        this.image = image;
    }
    render() {
        return `
            <div class="playlist-card">
                <img src="${this.image}" alt="${this.title} cover" />
                <h3>${this.title}</h3>
            </div>
        `;
    }
}
exports.default = PlaylistCard;
