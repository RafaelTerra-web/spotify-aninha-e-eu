import fs from 'fs';
import https from 'https';
import http from 'http';

function download(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
      },
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        download(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        console.log('Status:', response.statusCode);
        resolve(false);
        return;
      }

      const file = fs.createWriteStream(filename);
      let size = 0;
      response.on('data', (chunk) => { size += chunk.length; });
      response.on('end', () => {
        console.log('Downloaded:', (size / 1024 / 1024).toFixed(2), 'MB');
        resolve(true);
      });
      response.pipe(file);
    });

    request.on('error', (e) => {
      console.log('Error:', e.message);
      resolve(false);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

const urls = [
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_182229f63c.mp3',
  'https://cdn.pixabay.com/download/audio/2023/01/18/audio_d0a638734c.mp3',
];

let success = false;
for (const url of urls) {
  console.log('Trying:', url.substring(0, 60) + '...');
  if (await download(url, 'public/music/nossa-musica.mp3')) {
    success = true;
    break;
  }
}

if (!success) {
  console.log('All downloads failed - will use fallback');
} else {
  console.log('Music downloaded successfully!');
}
