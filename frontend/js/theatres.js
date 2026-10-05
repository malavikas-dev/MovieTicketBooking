document.addEventListener(
    "DOMContentLoaded",
    loadTheatres
);


async function loadTheatres() {

    const city =
        localStorage.getItem(
            "selectedCity"
        );


    const movieId =
        localStorage.getItem(
            "selectedMovieId"
        );


    const theatreList =
        document.getElementById(
            "theatreList"
        );


    const locationText =
        document.getElementById(
            "locationText"
        );


    if (city) {

        locationText.textContent =
            `Theatres in ${city}`;

    } else {

        locationText.textContent =
            "Available theatres";
    }


    try {

        const theatres =
            await getTheatres(
                city,
                movieId
            );


        theatreList.innerHTML = "";


        if (!theatres ||
            theatres.length === 0) {

            theatreList.innerHTML =
                "<p>No theatres available.</p>";

            return;
        }


        theatres.forEach(theatre => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "theatre-card";


            card.innerHTML = `

                <h3>
                    ${theatre.name || "Theatre"}
                </h3>

                <p>
                    📍
                    ${theatre.location || "N/A"}
                </p>

                <p>
                    ${theatre.address || ""}
                </p>

                <br>

                <button
                    class="btn"
                    onclick="selectTheatre(${theatre.id})">

                    View Shows

                </button>

            `;


            theatreList.appendChild(
                card
            );

        });

    }

    catch (error) {

        console.error(error);

        theatreList.innerHTML =
            "<p>Unable to load theatres.</p>";
    }
}


function selectTheatre(theatreId) {

    localStorage.setItem(
        "selectedTheatreId",
        theatreId
    );


    window.location.href =
        "shows.html";
}