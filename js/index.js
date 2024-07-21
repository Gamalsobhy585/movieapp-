document.addEventListener('DOMContentLoaded', function() {
  const categories = document.querySelectorAll('.category');
  const searchInput = document.getElementById('search-input');
  let allMovies = [];

  // Event listeners for category navigation
  categories.forEach((category) => {
      category.addEventListener('click', () => {
          const categoryType = category.getAttribute('data-category');
      //  toggleLoadingElements(true);
          getMovies(categoryType);

      });
  });

  // Event listener for search input
  searchInput.addEventListener('input', () => {
      const searchQuery = searchInput.value.trim();
      if (searchQuery === "") {
          getMovies('now_playing');
      } else {
          searchMovie(searchQuery);
      }
  });

  // Initial fetch of movies
  getMovies();

  // Function to fetch movies
  async function getMovies(category = 'now_playing') {
    toggleLoadingElements(true); 
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYzA3MTRhZGIxZDllNTM5M2NlN2JkOTQ4MTRiY2RiYSIsIm5iZiI6MTcyMTQ3Njk4NC4xMzMxMTIsInN1YiI6IjY2MzUyMjkyNjYxMWI0MDEyYTY3MzMwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NcbKYgxr8IZhArpCdzSatnCqP7ZgX7tOHsB5yz84q6Q'
      }
    };
  
    const url = category === 'trending/movie/day' 
      ? `https://api.themoviedb.org/3/trending/movie/day?language=en-US`
      : `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`;
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      allMovies = data.results;
      displayMovies(allMovies);
    } catch (err) {
      console.error(err);
    } finally {
      toggleLoadingElements(false); 
    }
  }
  
  categories.forEach((category) => {
    category.addEventListener('click', () => {
      const categoryType = category.getAttribute('data-category');
      // toggleLoadingElements();

      getMovies(categoryType);
    });
  });
  // Function to display movies
  function displayMovies(movies) {
      const container = document.querySelector('.row');
      container.innerHTML = '';

      movies.forEach(movie => {
          const movieElement = document.createElement('div');
          movieElement.className = 'col-lg-4 col-md-6 col-sm-12 animate_animated animate_fadeIn';
          movieElement.innerHTML = `
              <div class="item m-4 movie-card overflow-hidden position-relative animate_fadeIn">
                  <div class="cardImage animate_fadeIn">
                      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="img-fluid animate" alt="${movie.title}">
                  </div>
                  <div class="overlay overflow-hidden animate__fadeIn">
                      <h1 class="animate__animated h3 title ">${movie.title}</h1>
                      <h3 class="animate__animated h6 desc ">${movie.overview}</h3>
                      <p class="animate__animated date h6 ">Release-date:  ${movie.release_date}</p>
                      <p class="animate__animated rate h6 vote ">${movie.vote_average.toFixed(1)}</p>
                      <h3 class="animate__animated popularity h2 ">Popularity: ${movie.popularity.toFixed(0)}</h3>
                      <div class="animate__animated stars ">${getStars(movie.vote_average)}</div>
                  </div>
              </div>
          `;
          const overlay = movieElement.querySelector('.overlay');
          movieElement.addEventListener('mouseover', () => {
              overlay.classList.remove('animate__slideOutLeft');
              overlay.classList.add('animate__flipInX animate__delay-0s');
          });
          movieElement.addEventListener('mouseout', () => {
              overlay.classList.remove('animate__flipInX');
              overlay.classList.add('animate__slideOutLeft');
          });
          container.appendChild(movieElement);
      });
  }

  // Function to generate star ratings
  function getStars(rating) {
      const stars = Math.round(rating / 2);
      let starHtml = '';
      for (let i = 0; i < 5; i++) {
          starHtml += i < stars ? '★' : '☆';
      }
      return starHtml;
  }

  // Function to search movies from API
  async function searchMovie(term) {
      const url = `https://api.themoviedb.org/3/search/movie?query=${term}&api_key=ec0714adb1d9e5393ce7bd94814bcdba&language=en-US&include_adult=false`;

      try {
          const response = await fetch(url);
          if (response.ok) {
              const data = await response.json();
              const results = data.results;
              displayMovies(results);
          }
      } catch (err) {
          console.error(err);
      }
  }
});
// Contact form validation and message storage
  const registerBtn = document.getElementById('registerBtn');
  const formFields = ['name', 'email', 'age', 'phone', 'message'];
  const usersMessageContainer = JSON.parse(localStorage.getItem('usersMessages')) || [];

  // Validation regex patterns
  const regex = {
      name: /^[a-zA-Z0-9_-]{3,15}$/,
      email: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
      phone: /^\+20[0-9]{10}$/,
      age: /^(1[6-9]|[2-7][0-9]|80)$/,
      message: /^(?!\s*$).{10,}$/
  };

  registerBtn.addEventListener('click', function (event) {
      event.preventDefault();
      const errors = [];

      formFields.forEach(field => {
          if (!validateUserMessage(field)) {
              errors.push(getErrorMessage(field));
          }
      });

      if (errors.length === 0) {
          addUserMessage();
          window.open("/index.html", "_self");
      }
  });

  function validateUserMessage(field) {
      const input = document.getElementById(field);
      const errorElement = document.getElementById(field + 'Error');

      if (input.value.trim() === '') {
          hideErrorMessage(field);
          return false;
      }

      if (regex[field].test(input.value)) {
          input.classList.add('is-valid');
          input.classList.remove('is-invalid');
          errorElement.textContent = '';
          return true;
      } else {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          errorElement.textContent = getErrorMessage(field);
          return false;
      }
  }

  function getErrorMessage(field) {
      switch (field) {
          case 'name':
              return 'Name must contain 3 characters or more.';
          case 'email':
              return 'Email must be valid.';
          case 'phone':
              return 'Please enter a valid phone number (e.g., +201234567890).';
          case 'age':
              return 'Age must be between 16 & 80.';
          case 'message':
              return 'Message must be at least 10 characters long.';
          default:
              return '';
      }
  }

  function addUserMessage() {
      const userMessage = {};
      formFields.forEach(field => {
          userMessage[field] = document.getElementById(field).value;
      });
      usersMessageContainer.push(userMessage);
      localStorage.setItem('usersMessages', JSON.stringify(usersMessageContainer));
      clearForm();
  }

  function clearForm() {
      formFields.forEach(field => {
          document.getElementById(field).value = '';
      });
  }

  function hideErrorMessage(field) {
      const input = document.getElementById(field);
      const errorElement = document.getElementById(field + 'Error');
      if (input.value.trim() === '') {
          input.classList.remove('is-valid', 'is-invalid');
          errorElement.textContent = '';
      }
  }

// Sidenav functionality
document.addEventListener('DOMContentLoaded', function () {
  const navMenu = document.getElementById('nav-menu');
  const sideNav = document.getElementById('side-nav');
  const closeNav = document.getElementById('close-nav');

  navMenu.addEventListener('click', function () {
      sideNav.classList.toggle('active');
  });

  closeNav.addEventListener('click', function () {
      sideNav.classList.remove('active');
  });
});


document.addEventListener('DOMContentLoaded', function() {
  hideLoadingElements();
});

function hideLoadingElements() {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(element => {
    setTimeout(() => {
      element.style.transition = 'opacity 5s';
      element.style.opacity = 1;
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000); 
    }, 5000);
  });
}

function toggleLoadingElements(show) {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(element => {
    if (show) {
      element.style.display = 'block';
      setTimeout(() => {
        element.style.opacity = 1;
      }, 5000); 
    } else {
      element.style.transition = 'opacity 5s';
      element.style.opacity = 0;
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000);
    }
  });
}
