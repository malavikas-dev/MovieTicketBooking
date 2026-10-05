document.addEventListener(
    "DOMContentLoaded",
    loadTicket
);


async function loadTicket() {

    const bookingId =
        localStorage.getItem(
            "bookingId"
        );


    const movieId =
        localStorage.getItem(
            "selectedMovieId"
        );


    const showTime =
        localStorage.getItem(
            "selectedShowTime"
        );


    const seatNames =
        JSON.parse(
            localStorage.getItem(
                "selectedSeatNames"
            ) || "[]"
        );


    const total =
        localStorage.getItem(
            "selectedTotal"
        ) || 0;


    document.getElementById(
        "bookingId"
    ).textContent =
        bookingId || "N/A";


    document.getElementById(
        "showTime"
    ).textContent =
        showTime || "N/A";


    document.getElementById(
        "seatNames"
    ).textContent =
        seatNames.length
            ? seatNames.join(", ")
            : "N/A";


    document.getElementById(
        "totalAmount"
    ).textContent =
        total;


    try {

        const movie =
            await getMovie(movieId);


        document.getElementById(
            "movieName"
        ).textContent =
            movie.title || "Movie";

    }

    catch (error) {

        console.error(error);

        document.getElementById(
            "movieName"
        ).textContent =
            "Movie";

    }
}