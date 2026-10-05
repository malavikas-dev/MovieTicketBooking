document.addEventListener(
    "DOMContentLoaded",
    loadBookingHistory
);


// =========================================================
// LOAD BOOKING HISTORY
// =========================================================

async function loadBookingHistory() {

    const userId =
        localStorage.getItem("userId");

    const container =
        document.getElementById("bookingHistory");


    // =====================================================
    // CHECK LOGIN
    // =====================================================

    if (!userId) {

        container.innerHTML = `

            <p>
                Please login to view your bookings.
            </p>

            <br>

            <a
                href="login.html"
                class="btn">

                Login

            </a>

        `;

        return;
    }


    try {

        // =================================================
        // GET BOOKINGS
        // =================================================

        const bookings =
            await getBookingHistory(userId);


        container.innerHTML = "";


        // =================================================
        // NO BOOKINGS
        // =================================================

        if (
            !bookings ||
            bookings.length === 0
        ) {

            container.innerHTML =
                "<p>No bookings found.</p>";

            return;

        }


        // =================================================
        // CREATE EACH BOOKING TICKET
        // =================================================

        bookings.forEach(
            (booking, index) => {

                // -----------------------------------------
                // SHOWTIME
                // -----------------------------------------

                const showtime =
                    booking.showtime;


                // -----------------------------------------
                // MOVIE
                // -----------------------------------------

                const movieName =
                    showtime &&
                    showtime.movie
                        ? showtime.movie.title
                        : "Movie";


                // -----------------------------------------
                // THEATRE
                // -----------------------------------------

                const theatreName =
                    showtime &&
                    showtime.theatre
                        ? showtime.theatre.name
                        : "N/A";


                // -----------------------------------------
                // SHOW DATE
                // -----------------------------------------

                const showDate =
                    showtime &&
                    showtime.showDate
                        ? showtime.showDate
                        : "N/A";


                // -----------------------------------------
                // SHOW TIME
                // -----------------------------------------

                let showTime = "N/A";


                if (
                    showtime &&
                    showtime.showTime
                ) {

                    showTime =
                        formatTime(
                            showtime.showTime
                        );

                }


                // -----------------------------------------
                // SEATS
                // -----------------------------------------

                const seats =
                    booking.seats &&
                    booking.seats.length
                        ? booking.seats
                            .map(
                                item =>
                                    item.seat
                                        ? item.seat.seatNumber
                                        : "Seat"
                            )
                            .join(", ")
                        : "N/A";


                // -----------------------------------------
                // TOTAL
                // -----------------------------------------

                const total =
                    Number(
                        booking.totalAmount
                    ) || 0;


                // -----------------------------------------
                // STATUS
                // -----------------------------------------

                const status =
                    booking.status ||
                    "CONFIRMED";


                // -----------------------------------------
                // CREATE BOOKING CARD
                // -----------------------------------------

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "booking-card";


                // =================================================
                // TICKET HTML
                // =================================================

                card.innerHTML = `

                    <div class="booking-info">

                        <div class="ticket-label">
                            MOVIE TICKET
                        </div>

                        <div class="ticket-line"></div>

                        <h3>
                            ${movieName}
                        </h3>

                        <p>
                            <strong>Theatre:</strong>
                            ${theatreName}
                        </p>

                        <p>
                            <strong>Date:</strong>
                            ${showDate}
                        </p>

                        <p>
                            <strong>Showtime:</strong>
                            ${showTime}
                        </p>

                        <p>
                            <strong>Seats:</strong>
                            ${seats}
                        </p>

                    </div>


                    <div class="booking-price">

                        <div class="ticket-number">
                            TICKET #${booking.id}
                        </div>

                        <div class="price">
                            ₹${total.toFixed(2)}
                        </div>

                        <div class="booking-status">
                            ✓ ${status}
                        </div>

                        <!-- QR CODE -->
                        <div
                            class="booking-qr"
                            id="qr-${booking.id}">
                        </div>

                    </div>

                `;


                // =================================================
                // ADD CARD TO PAGE
                // =================================================

                container.appendChild(
                    card
                );


                // =================================================
                // CREATE QR CODE
                // =================================================

                new QRCode(

                    document.getElementById(
                        `qr-${booking.id}`
                    ),

                    {

                        text: JSON.stringify({

                            bookingId:
                                booking.id,

                            movie:
                                movieName,

                            theatre:
                                theatreName,

                            showDate:
                                showDate,

                            showTime:
                                showtime &&
                                showtime.showTime
                                    ? showtime.showTime
                                    : "",

                            seats:
                                seats,

                            total:
                                total,

                            status:
                                status

                        }),

                        width: 90,

                        height: 90

                    }

                );

            }
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    catch (error) {

        console.error(
            "Unable to load booking history:",
            error
        );


        container.innerHTML =
            "<p>Unable to load booking history.</p>";

    }

}


// =========================================================
// FORMAT TIME
// =========================================================

function formatTime(time) {

    if (!time) {

        return "N/A";

    }


    const parts =
        time.split(":");


    let hours =
        Number(parts[0]);


    const minutes =
        parts[1] || "00";


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    return `${hours}:${minutes} ${period}`;

}