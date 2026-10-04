document.addEventListener(
    "DOMContentLoaded",
    loadBookingHistory
);


async function loadBookingHistory() {

    const userId =
        localStorage.getItem(
            "userId"
        );


    const container =
        document.getElementById(
            "bookingHistory"
        );


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

        const bookings =
            await getBookingHistory(
                userId
            );


        container.innerHTML = "";


        if (!bookings ||
            bookings.length === 0) {

            container.innerHTML =
                "<p>No bookings found.</p>";

            return;
        }


        bookings.forEach(
            booking => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "booking-card";


                card.innerHTML = `

                    <h3>
                        ${booking.movieTitle || "Movie"}
                    </h3>

                    <p>
                        Theatre:
                        ${booking.theatreName || "N/A"}
                    </p>

                    <p>
                        Showtime:
                        ${booking.showTime || "N/A"}
                    </p>

                    <p>
                        Seats:
                        ${booking.seats || "N/A"}
                    </p>

                    <p>
                        Total:
                        ₹${booking.totalAmount || 0}
                    </p>

                `;


                container.appendChild(
                    card
                );

            }
        );

    }

    catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load booking history.</p>";
    }
}