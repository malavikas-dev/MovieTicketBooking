// =========================================================
// MOVIEBOOK DEMO PAYMENT
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    initializePayment
);


// =========================================================
// INITIALIZE
// =========================================================

async function initializePayment() {

    await loadBookingDetails();

    setupPaymentMethods();

    setupPayButton();

}


// =========================================================
// LOAD BOOKING DETAILS
// =========================================================

async function loadBookingDetails() {

    const movieId =
        localStorage.getItem(
            "selectedMovieId"
        );

    const showId =
        localStorage.getItem(
            "selectedShowId"
        );

    const showTime =
        localStorage.getItem(
            "selectedShowTime"
        ) || "";

    const seatNames =
        JSON.parse(
            localStorage.getItem(
                "selectedSeatNames"
            ) || "[]"
        );

    const total =
        Number(
            localStorage.getItem(
                "selectedTotal"
            )
        ) || 0;


    // -----------------------------------------
    // TICKET COUNT
    // -----------------------------------------

    document.getElementById(
        "ticketCount"
    ).textContent =
        seatNames.length;


    // -----------------------------------------
    // SEATS
    // -----------------------------------------

    document.getElementById(
        "seatDetails"
    ).textContent =
        seatNames.length
            ? `Seats: ${seatNames.join(", ")}`
            : "Seats not available";


    // -----------------------------------------
    // SHOWTIME
    // -----------------------------------------

    document.getElementById(
        "showDetails"
    ).textContent =
        showTime
            ? `Showtime: ${formatTime(showTime)}`
            : "Showtime not available";


    // -----------------------------------------
    // MOVIE
    // -----------------------------------------

    if (movieId) {

        try {

            const movie =
                await getMovie(movieId);


            document.getElementById(
                "movieName"
            ).textContent =
                movie.title || "Movie";


            localStorage.setItem(
                "selectedMovieName",
                movie.title || "Movie"
            );

        }

        catch (error) {

            console.error(
                "Unable to load movie:",
                error
            );


            document.getElementById(
                "movieName"
            ).textContent =
                "Movie Ticket";

        }

    }


    // -----------------------------------------
    // THEATRE
    // -----------------------------------------

    /*
     * Theatre name can be connected
     * once we retrieve it using the
     * selected theatre ID.
     */

    const theatreId =
        localStorage.getItem(
            "selectedTheatreId"
        );


    if (theatreId) {

        try {

            const response =
                await apiRequest(
                    `/theatres/${theatreId}`
                );


            if (response) {

                const theatreName =
                    response.name ||
                    "Selected Theatre";


                document.getElementById(
                    "theatreDetails"
                ).textContent =
                    theatreName;


                localStorage.setItem(
                    "selectedTheatreName",
                    theatreName
                );

            }

        }

        catch (error) {

            console.warn(
                "Theatre name could not be loaded."
            );

            document.getElementById(
                "theatreDetails"
            ).textContent =
                "Selected Theatre";

        }

    }


    // -----------------------------------------
    // PRICE
    // -----------------------------------------

    const convenienceFee =
        seatNames.length > 0
            ? 20
            : 0;


    const orderTotal =
        total + convenienceFee;


    document.getElementById(
        "ticketAmount"
    ).textContent =
        total.toFixed(2);


    document.getElementById(
        "convenienceFee"
    ).textContent =
        convenienceFee.toFixed(2);


    document.getElementById(
        "orderTotal"
    ).textContent =
        orderTotal.toFixed(2);


    document.getElementById(
        "payAmount"
    ).textContent =
        orderTotal.toFixed(2);


    localStorage.setItem(
        "paymentAmount",
        orderTotal
    );

}


// =========================================================
// PAYMENT METHOD SWITCHING
// =========================================================

function setupPaymentMethods() {

    const methods =
        document.querySelectorAll(
            ".payment-method"
        );


    const panels = {

        upi:
            document.getElementById(
                "upiPayment"
            ),

        card:
            document.getElementById(
                "cardPayment"
            ),

        wallet:
            document.getElementById(
                "walletPayment"
            ),

        voucher:
            document.getElementById(
                "voucherPayment"
            ),

        netbanking:
            document.getElementById(
                "netbankingPayment"
            )

    };


    methods.forEach(method => {

        method.addEventListener(
            "click",
            function () {

                methods.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                Object.values(panels)
                    .forEach(panel => {

                        if (panel) {

                            panel.classList.remove(
                                "active"
                            );

                        }

                    });


                const selectedMethod =
                    this.dataset.method;


                if (
                    panels[selectedMethod]
                ) {

                    panels[
                        selectedMethod
                    ].classList.add(
                        "active"
                    );

                }

            }
        );

    });

}


// =========================================================
// PAY BUTTON
// =========================================================

function setupPayButton() {

    const payButton =
        document.getElementById(
            "payButton"
        );


    payButton.addEventListener(
        "click",
        processDemoPayment
    );

}


// =========================================================
// DEMO PAYMENT
// =========================================================

function processDemoPayment() {

    const activeMethod =
        document.querySelector(
            ".payment-method.active"
        );


    const method =
        activeMethod
            ? activeMethod.dataset.method
            : "upi";


    const amount =
        Number(
            localStorage.getItem(
                "paymentAmount"
            )
        ) || 0;


    if (amount <= 0) {

        alert(
            "Unable to determine payment amount."
        );

        return;

    }


    // -----------------------------------------
    // UPI VALIDATION
    // -----------------------------------------

    if (method === "upi") {

        const upi =
            document.getElementById(
                "upiId"
            ).value.trim();


        if (!upi) {

            alert(
                "Please enter a UPI ID."
            );

            return;

        }

    }


    // -----------------------------------------
    // CARD VALIDATION
    // -----------------------------------------

    if (method === "card") {

        const cardInputs =
            document.querySelectorAll(
                "#cardPayment input"
            );


        for (
            const input of cardInputs
        ) {

            if (
                !input.value.trim()
            ) {

                alert(
                    "Please enter all card details."
                );

                return;

            }

        }

    }


    // -----------------------------------------
    // PROCESS PAYMENT
    // -----------------------------------------

    const payButton =
        document.getElementById(
            "payButton"
        );


    payButton.disabled = true;

    payButton.textContent =
        "Processing Payment...";


    setTimeout(
        function () {

            completeDemoPayment(
                amount,
                method
            );

        },
        1800
    );

}


// =========================================================
// PAYMENT SUCCESS
// =========================================================

async function completeDemoPayment(amount, method) {

    const showId =
        localStorage.getItem("pendingBookingShowId");

    const seatIds =
        JSON.parse(
            localStorage.getItem("pendingBookingSeatIds") || "[]"
        );

    const customerName =
        localStorage.getItem("pendingCustomerName");

    const customerEmail =
        localStorage.getItem("pendingCustomerEmail");


    if (!showId || !seatIds.length) {

        alert(
            "Booking information is missing."
        );

        return;
    }


    try {

        const bookingResponse =
    await createBooking({

        showId: Number(showId),

        seatIds: seatIds.map(
            id => Number(id)
        ),

        customerName:
            customerName,

        customerEmail:
            customerEmail
    });


        console.log(
            "Booking created:",
            bookingResponse
        );


       const paymentResponse =
    await createPayment({

        bookingId:
            bookingResponse.id,

        amount:
            amount,

        paymentMethod:
            method
    });


        console.log(
            "Payment created:",
            paymentResponse
        );


        // Store real booking/payment information

        localStorage.setItem(
            "paymentStatus",
            paymentResponse.paymentStatus
        );

        localStorage.setItem(
            "paymentId",
            paymentResponse.transactionId
        );

        localStorage.setItem(
            "bookingId",
            bookingResponse.id
        );

        localStorage.setItem(
            "paymentMethod",
            paymentResponse.paymentMethod
        );

        localStorage.setItem(
            "paidAmount",
            paymentResponse.amount
        );


        // Go to success page

        window.location.href =
            "payment-success.html";


        } catch (error) {

        console.error(
            "Booking/payment error:",
            error
        );

        const message =
            error.message || "";

        if (
            message.includes(
                "already booked"
            )
        ) {

            alert(
                "Sorry! One or more selected seats are already booked. Please go back and choose another seat."
            );

        } else {

            alert(
                "Booking could not be completed. Please try again."
            );

        }

        const payButton =
            document.getElementById("payButton");

        payButton.disabled = false;

        payButton.textContent =
            `Pay ₹${amount.toFixed(2)}`;
    }

}   // <-- THIS WAS MISSING


// =========================================================
// TIME FORMATTER
// =========================================================

function formatTime(time) {

    if (!time) {

        return "";

    }

    const parts =
        time.split(":");

    let hours =
        Number(parts[0]);

    const minutes =
        parts[1];

    const period =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;

}