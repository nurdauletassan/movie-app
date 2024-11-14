const apiKey = '447909934804f816ecdf546440cd6f51';
const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const homeSpan = document.getElementById('homeSpan');
const movieGridContainer = document.getElementById('movieGridContainer');
const watchlistContainer = document.getElementById('watchlistContainer');
const body = document.body;

const searchContainer = document.querySelector('.search-container');
const filterIcon = document.getElementById('filterIcon');
const filterDropdown = document.getElementById('filterDropdown');
const filterOptions = document.querySelectorAll('.filter-option');
const movieModal = document.getElementById('movieModal');
const movieDetailsContainer = document.getElementById('modalMovieDetails');

const closeModalBtn = document.querySelector('.close');

// Инициализируем watchlist из localStorage
// Initialize watchlist from localStorage
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];


function saveWatchlist() {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}
// Show movie details and initialize watchlist button
async function showMovieDetails(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
    const movie = await response.json();

    // Проверяем, сохранен ли фильм в watchlist
    const isSaved = watchlist.some(item => item.id === movie.id);
    
    // Определяем текст кнопки в зависимости от состояния фильма
    const buttonText = isSaved ? 'Remove from Watchlist' : 'Add to Watchlist';

    const movieDetailsContainer = document.getElementById('modalMovieDetails'); // Updated reference here

    movieDetailsContainer.innerHTML = `
        <div class="movie-details-container">
            <h2>${movie.title}</h2>
            <div class="many-texts">
                <p><strong>Overview:</strong> ${movie.overview}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Rating:</strong> ${movie.vote_average}</p>
                <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
                <button id="toggleWatchlist" class="watchlist-btn">
                    ${buttonText}
                </button>
            </div>
        </div>
    `;

    // Назначаем обработчик на кнопку добавления/удаления фильма из watchlist
    document.getElementById('toggleWatchlist').addEventListener('click', () => toggleWatchlist(movie));

    movieModal.style.display = 'block';
}

function toggleWatchlist(movie) {
    const isSaved = watchlist.some(item => item.id === movie.id);

    if (isSaved) {
        // Удалить фильм из watchlist
        watchlist = watchlist.filter(item => item.id !== movie.id);
    } else {
        // Добавить фильм в watchlist
        watchlist.push(movie);
    }

    // Сохранить обновленный watchlist в localStorage
    localStorage.setItem('watchlist', JSON.stringify(watchlist));

    // Обновить текст на кнопке в модальном окне
    const watchlistButton = document.querySelector('#toggleWatchlist');
    watchlistButton.textContent = isSaved ? 'Add to Watchlist' : 'Remove from Watchlist';
}


// Обновление кнопки на карточке фильма в зависимости от состояния в watchlist
function updateWatchlistButton(id) {
    const button = document.querySelector(`#movieCard${id} .watchlist-btn`);
    if (button) {
        button.textContent = watchlist.some(item => item.id === id) ? 'Remove from Watchlist' : 'Add to Watchlist';
    }
}
// Перемешивание карточек в гриде
// Перемешивание карточек в гриде
function shuffleCards() {
    const movieCards = Array.from(movieGrid.children);
    while (movieCards.length) {
        movieGrid.appendChild(movieCards.splice(Math.floor(Math.random() * movieCards.length), 1)[0]);
    }
}


// Close the modal when close button is clicked
closeModalBtn.addEventListener('click', () => {
    movieModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === movieModal) {
        movieModal.style.display = 'none';
    }
});

// Display saved watchlist movies
watchlistSpan.addEventListener('click', () => {
    displayMovies(watchlist);
});


// Загрузка популярных фильмов
async function loadPopularMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    const data = await response.json();
    displayMovies(data.results);
    shuffleCards();
}
window.onload = loadPopularMovies;

// Поиск фильмов по запросу
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query.length > 2) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json();
        displayMovies(data.results);
    }
});

// Открытие/закрытие выпадающего списка фильтров
filterIcon.addEventListener('click', () => {
    filterDropdown.style.display = filterDropdown.style.display === 'block' ? 'none' : 'block';
});

// Закрытие выпадающего списка фильтров при клике вне его области
document.addEventListener('click', (event) => {
    if (!filterDropdown.contains(event.target) && event.target !== filterIcon) {
        filterDropdown.style.display = 'none';
    }
});

// Обработчик выбора фильтра
filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        const filterType = option.getAttribute('data-filter');
        filterMovies(filterType);
        filterDropdown.style.display = 'none';
    });
});

// Фильтрация фильмов
async function filterMovies(filterType) {
    let endpoint = '';

    switch (filterType) {
        case 'popular':
            endpoint = 'popular';
            break;
        case 'release_date':
            endpoint = 'now_playing';
            break;
        case 'rating':
            endpoint = 'top_rated';
            break;
        default:
            endpoint = 'popular';
    }

    const response = await fetch(`https://api.themoviedb.org/3/movie/${endpoint}?api_key=${apiKey}`);
    const data = await response.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.id = `movieCard${movie.id}`;
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <button class="watchlist-btn">${watchlist.some(item => item.id === movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}</button>
        `;

        // Назначаем обработчик на кнопку добавления/удаления фильма из watchlist
        movieCard.querySelector('.watchlist-btn').addEventListener('click', () => {
            toggleWatchlist(movie);
            displayMovies(watchlist); // Обновляем отображение после добавления/удаления
        });
        
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));

        movieGrid.appendChild(movieCard);
    });
}

async function showMovieDetails(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
    const movie = await response.json();

    // Проверяем, сохранен ли фильм в watchlist
    const isSaved = watchlist.some(item => item.id === movie.id);
    
    // Определяем текст кнопки в зависимости от состояния фильма
    const buttonText = isSaved ? 'Remove from Watchlist' : 'Add to Watchlist';

    movieDetailsContainer.innerHTML = `
        <div class="movie-details-container">
            <h2>${movie.title}</h2>
            <div class="many-texts">
                <p><strong>Overview:</strong> ${movie.overview}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Rating:</strong> ${movie.vote_average}</p>
                <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
                <button id="toggleWatchlist" class="watchlist-btn">
                    ${buttonText}
                </button>
            </div>
        </div>
    `;

    // Назначаем обработчик на кнопку добавления/удаления фильма из watchlist
    document.getElementById('toggleWatchlist').addEventListener('click', () => toggleWatchlist(movie));

    movieModal.style.display = 'block';
}


// Закрытие модального окна
if (movieModal && modalMovieDetails && closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        movieModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === movieModal) {
            movieModal.style.display = 'none';
        }
    });
}

// Добавление фильма в watchlist
// Function to add a movie to the watchlist



// If there is any saved movie, display it in the grid
window.onload = loadPopularMovies;  // or loadMovies() depending on your needs

const homeLogo = document.getElementById('homeLogo');

// Event listener to load popular movies and clear search/filter on logo click
homeLogo.addEventListener('click', () => {
    searchInput.value = '';  // Clear any search query
    displayMovies([]);       // Clear current movies from the grid
    loadPopularMovies();     // Load popular movies to reset the homepage
});


