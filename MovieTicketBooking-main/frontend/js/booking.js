document.addEventListener(
    "DOMContentLoaded",
    loadBookingSummary
);

async function loadBookingSummary() {

    const movieId =
        localStorage.getItem("selectedMovieId");

    const showTime =
        localStorage.getItem("selectedShowTime");

    const seatNames =
        JSON.parse(
            localStorage.getItem("selectedSeatNames") || "[]"
        );

    const total =
        localStorage.getItem("selectedTotal") || 0;

    document.getElementById("showTime").textContent =
        showTime || "N/A";

    document.getElementById("seatNames").textContent =
        seatNames.length
            ? seatNames.join(", ")
            : "No seats selected";

    document.getElementById("totalAmount").textContent =
        total;

    try {

        const movie =
            await getMovie(movieId);

        document.getElementById("movieName").textContent =
            movie.title || "Movie";

    } catch (error) {

        console.error(error);

        document.getElementById("movieName").textContent =
            "Movie";
    }
}


function confirmBooking() {

    const showId =
        localStorage.getItem("selectedShowId");

    const seatIds =
        JSON.parse(
            localStorage.getItem("selectedSeatIds") || "[]"
        );

    const seatNames =
        JSON.parse(
            localStorage.getItem("selectedSeatNames") || "[]"
        );

    const total =
        Number(
            localStorage.getItem("selectedTotal")
        ) || 0;


    const customerName =
        document.getElementById("customerName")
            .value
            .trim();

    const customerEmail =
        document.getElementById("customerEmail")
            .value
            .trim();


    // Validate booking information

    if (!showId) {

        alert(
            "Showtime information is missing."
        );

        return;
    }


    if (!seatIds.length) {

        alert(
            "No seats have been selected."
        );

        return;
    }


    if (!customerName) {

        alert(
            "Please enter your name."
        );

        return;
    }


    if (!customerEmail) {

        alert(
            "Please enter your email."
        );

        return;
    }


    // Save booking information temporarily

    localStorage.setItem(
        "pendingBookingShowId",
        showId
    );

    localStorage.setItem(
        "pendingBookingSeatIds",
        JSON.stringify(seatIds)
    );

    localStorage.setItem(
        "pendingBookingSeatNames",
        JSON.stringify(seatNames)
    );

    localStorage.setItem(
        "pendingBookingTotal",
        total
    );

    localStorage.setItem(
        "pendingCustomerName",
        customerName
    );

    localStorage.setItem(
        "pendingCustomerEmail",
        customerEmail
    );


    // Go to demo payment

    window.location.href =
        "payment.html";
}