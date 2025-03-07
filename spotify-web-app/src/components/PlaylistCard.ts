class PlaylistCard {
    title: string;
    image: string;

    constructor(title: string, image: string) {
        this.title = title;
        this.image = image;
    }

    render(): string {
        return `
            <div class="playlist-card">
                <img src="${this.image}" alt="${this.title} cover" />
                <h3>${this.title}</h3>
            </div>
        `;
    }
}

export default PlaylistCard;