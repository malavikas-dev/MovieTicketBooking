document.addEventListener(
    "DOMContentLoaded",
    loadMovies
);


async function loadMovies() {

    const city =
        localStorage.getItem("selectedCity");

    const movieList =
        document.getElementById("movieList");

    const cityName =
        document.getElementById("cityName");


    if (cityName) {

        cityName.textContent =
            city
                ? `Movies available in ${city}`
                : "All available movies";

    }


    try {

        const movies =
            await getMovies(city);

        movieList.innerHTML = "";


        if (!movies || movies.length === 0) {

            movieList.innerHTML =
                "<p>No movies available.</p>";

            return;

        }


        movies.forEach(movie => {

            const card =
                document.createElement("div");


            card.className =
                "movie-card";


            card.innerHTML = `

                <img
                    src="${movie.posterUrl || 'https://via.placeholder.com/300x400?text=Movie'}"
                    alt="${movie.title || 'Movie'}"
                >

                <h3>
                    ${movie.title || "Untitled Movie"}
                </h3>

                <p>
                    Language:
                    ${movie.language || "N/A"}
                </p>

                <p>
                    Genre:
                    ${movie.genre || "N/A"}
                </p>

                <p>
                    ⭐ ${movie.rating || "N/A"}
                </p>

                <button
                    class="btn"
                    onclick="openMovie(${movie.id})">

                    View Details

                </button>

            `;


            movieList.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

        movieList.innerHTML =
            "<p>Unable to load movies.</p>";

    }

}


function openMovie(movieId) {

    localStorage.setItem(
        "selectedMovieId",
        movieId
    );


    window.location.href =
        "movie-details.html";
}