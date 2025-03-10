import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="/path/to/your/styles.css" />
          <meta name="description" content="A web app to view Spotify playlists with a UI inspired by Apple Music." />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;