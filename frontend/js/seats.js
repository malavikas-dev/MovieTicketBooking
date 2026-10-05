let selectedSeats = [];

let ticketPrice = 0;


document.addEventListener(
    "DOMContentLoaded",
    loadSeats
);


async function loadSeats() {

    const showId =
        localStorage.getItem(
            "selectedShowId"
        );


    ticketPrice =
        Number(
            localStorage.getItem(
                "selectedTicketPrice"
            )
        ) || 0;


    document.getElementById(
        "showTime"
    ).textContent =
        localStorage.getItem(
            "selectedShowTime"
        ) || "";


    const seatGrid =
        document.getElementById(
            "seatGrid"
        );


    try {

        const seats =
            await getSeats(showId);


        seatGrid.innerHTML = "";


        if (!seats ||
            seats.length === 0) {

            seatGrid.innerHTML =
                "<p>No seats available.</p>";

            return;
        }


        seats.forEach(seat => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "seat";


            button.textContent =
                seat.seatNumber ||
                seat.name ||
                seat.id;


            const status =
                String(
                    seat.status ||
                    "AVAILABLE"
                ).toUpperCase();


            if (status === "BOOKED") {

                button.classList.add(
                    "booked"
                );

                button.disabled = true;

            }

            else {

                button.classList.add(
                    "available"
                );


                button.onclick =
                    function() {

                        toggleSeat(
                            seat,
                            button
                        );

                    };
            }


            seatGrid.appendChild(
                button
            );

        });

    }

    catch (error) {

        console.error(error);

        seatGrid.innerHTML =
            "<p>Unable to load seats.</p>";
    }
}


function toggleSeat(
    seat,
    button
) {

    const seatId =
        seat.id;


    const index =
        selectedSeats.findIndex(
            item =>
                item.id === seatId
        );


    if (index === -1) {

        selectedSeats.push(
            seat
        );


        button.classList.remove(
            "available"
        );


        button.classList.add(
            "selected"
        );

    }

    else {

        selectedSeats.splice(
            index,
            1
        );


        button.classList.remove(
            "selected"
        );


        button.classList.add(
            "available"
        );
    }


    updateSeatSummary();
}


function updateSeatSummary() {

    const names =
        selectedSeats.map(
            seat =>
                seat.seatNumber ||
                seat.name ||
                seat.id
        );


    document.getElementById(
        "selectedSeats"
    ).textContent =
        names.length
            ? names.join(", ")
            : "None";


    const total =
        selectedSeats.length *
        ticketPrice;


    document.getElementById(
        "totalAmount"
    ).textContent =
        total;
}


function continueToBooking() {

    if (selectedSeats.length === 0) {

        alert(
            "Please select at least one seat."
        );

        return;
    }


    localStorage.setItem(
        "selectedSeatIds",

        JSON.stringify(
            selectedSeats.map(
                seat => seat.id
            )
        )
    );


    localStorage.setItem(
        "selectedSeatNames",

        JSON.stringify(
            selectedSeats.map(
                seat =>
                    seat.seatNumber ||
                    seat.name ||
                    seat.id
            )
        )
    );


    localStorage.setItem(
        "selectedTotal",

        selectedSeats.length *
        ticketPrice
    );


    window.location.href =
        "booking.html";
}