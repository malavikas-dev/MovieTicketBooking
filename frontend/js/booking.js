document.addEventListener(
    "DOMContentLoaded",
    loadBookingSummary
);


async function loadBookingSummary() {

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
        "showTime"
    ).textContent =
        showTime || "N/A";


    document.getElementById(
        "seatNames"
    ).textContent =
        seatNames.length
            ? seatNames.join(", ")
            : "No seats selected";


    document.getElementById(
        "totalAmount"
    ).textContent =
        total;


    /*
     * Get movie name from backend
     */

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


async function confirmBooking() {

    const movieId =
        localStorage.getItem(
            "selectedMovieId"
        );


    const showId =
        localStorage.getItem(
            "selectedShowId"
        );


    const seatIds =
        JSON.parse(
            localStorage.getItem(
                "selectedSeatIds"
            ) || "[]"
        );


    if (!movieId ||
        !showId ||
        seatIds.length === 0) {

        alert(
            "Booking information is incomplete."
        );

        return;
    }


    const bookingData = {

        movieId: Number(movieId),

        showId: Number(showId),

        seatIds: seatIds

    };


    try {

        const booking =
            await createBooking(
                bookingData
            );


        localStorage.setItem(
            "bookingId",
            booking.id ||
            booking.bookingId
        );


        window.location.href =
            "ticket.html";

    }

    catch (error) {

        console.error(error);

        alert(
            "Booking failed. Please try again."
        );

    }
}