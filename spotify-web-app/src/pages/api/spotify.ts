export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    'Authorization': `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}