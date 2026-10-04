document.addEventListener(
    "DOMContentLoaded",
    loadMovieDetails
);


async function loadMovieDetails() {

    const movieId =
        localStorage.getItem("selectedMovieId");


    const container =
        document.getElementById(
            "movieDetails"
        );


    if (!movieId) {

        container.innerHTML =
            "<p>No movie selected.</p>";

        return;
    }


    try {

        const movie =
            await getMovie(movieId);


        container.innerHTML = `

            <img
                src="${
                    movie.poster ||
                    'https://via.placeholder.com/300x400?text=Movie'
                }"
                alt="${movie.title || 'Movie'}"
            >

            <h1>
                ${movie.title || "Movie"}
            </h1>

            <br>

            <p>
                ${
                    movie.description ||
                    "No description available."
                }
            </p>

            <br>

            <p>
                <strong>Language:</strong>
                ${movie.language || "N/A"}
            </p>

            <p>
                <strong>Genre:</strong>
                ${movie.genre || "N/A"}
            </p>

            <p>
                <strong>Rating:</strong>
                ⭐ ${movie.rating || "N/A"}
            </p>

            <br>

            <button
                class="btn"
                onclick="chooseTheatre()">

                Select Theatre

            </button>

        `;

    }

    catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load movie details.</p>";
    }
}


function chooseTheatre() {

    window.location.href =
        "theatres.html";
}