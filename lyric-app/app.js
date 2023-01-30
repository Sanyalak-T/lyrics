/** @format */

const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh/v1/';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const songtxt = search.value.trim();

  if (!songtxt) {
    alert('Key Something');
  } else {
    searchLyrics(songtxt);
  }
});

async function searchLyrics(song) {
  const res = await fetch(`${apiURL}/suggest/${song}`);
  const allSong = await res.json();
  showData(allSong);
}

function showData(songs) {
  result.innerHTML = `
        <ul class="songs">
            ${songs.data
              .map(
                (song) =>
                  ` <li>
                    <span>
                        <strong>${song.artist.name}</strong> - ${song.title}
                    </span>
                    <button class="btn" data-artist="${song.artist.name}" data-song="${song.title}">
                        Lyrics
                    </button>
                </li>
                `
              )
              .join('')}
        </ul>
    `;

  if (songs.next || songs.prev) {
    more.innerHTML = `
            ${
              songs.prev
                ? `<button class="btn" onclick="getMoreSongs(${songs.prev})">Prev</button>`
                : ''
            }
            ${
              songs.next
                ? `<button class="btn" onclick="getMoreSongs(${songs.next})">Next</button>`
                : ''
            }
        `;
  } else {
    more.innerHTML = '';
  }
}

async function getMoreSongs(songsUrl) {
  const res = await fetch(`${apiURL}/suggest/${songsUrl}`);
  const allSong = await res.json();
  showData(allSong);
}

result.addEventListener('click', (e) => {
  const clickEl = e.target;

  if (clickEl.tagName == 'BUTTON') {
    const artist = clickEl.getAttribute('data-artist');
    const songName = clickEl.getAttribute('data-song');
  }

  getLyrics(artist, songName);
});

async function getLyrics(artist, songName) {
  const res = await fetch(`${artist}/v1/${songName}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  if (lyrics) {
    result.innerHTML = `
            <h2>
                <span>
                    <strong>${artist}</strong> - ${songName}
                </span>
            </h2>
        `;
  } else {
    result.innerHTML = `
            <h2>
                <span>
                    <strong>${artist}</strong> - ${songName}
                </span>
            </h2>
            <span>No data!</span>
        `;
  }
  more.innerHTML = '';
}
