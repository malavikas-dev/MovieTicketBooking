let selectedSeats = [];

let ticketPrice = 0;

let maximumSeats = 1;

let seatSelectionStarted = false;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeSeatPage
);


async function initializeSeatPage() {

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
        formatTime(
            localStorage.getItem(
                "selectedShowTime"
            ) || ""
        );


    /*
     * Show price information
     */

    document.getElementById(
        "premiumPreviewPrice"
    ).textContent =
        ticketPrice;


    document.getElementById(
        "regularPreviewPrice"
    ).textContent =
        ticketPrice;


    /*
     * Setup seat count buttons
     */

    setupSeatCountSelector();


    /*
     * Load seats in background
     */

    await loadSeats();

}


// =====================================================
// SEAT COUNT SELECTOR
// =====================================================

function setupSeatCountSelector() {

    const options =
        document.querySelectorAll(
            ".seat-count-option"
        );


    options.forEach(option => {

        option.addEventListener(
            "click",
            function () {

                options.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );


                maximumSeats =
                    Number(
                        this.dataset.count
                    );

            }
        );

    });


    /*
     * Default selection = 1
     */

    if (options.length > 0) {

        options[0].classList.add(
            "active"
        );

        maximumSeats = 1;

    }


    /*
     * Select Seats button
     */

    document.getElementById(
        "confirmSeatCount"
    ).addEventListener(
        "click",
        confirmSeatCount
    );

}


// =====================================================
// CONFIRM NUMBER OF SEATS
// =====================================================

function confirmSeatCount() {

    seatSelectionStarted = true;


    document.getElementById(
        "seatLimitText"
    ).textContent =
        maximumSeats;


    /*
     * Close modal
     */

    document.getElementById(
        "seatCountModal"
    ).classList.add(
        "hidden"
    );


    /*
     * Enable seat interaction
     */

    const availableSeats =
        document.querySelectorAll(
            ".seat.available"
        );


    availableSeats.forEach(
        seat => {

            seat.classList.add(
                "seat-ready"
            );

        }
    );

}


// =====================================================
// LOAD SEATS
// =====================================================

async function loadSeats() {

    const showId =
        localStorage.getItem("selectedShowId");

    ticketPrice =
        Number(
            localStorage.getItem("selectedTicketPrice")
        ) || 0;


    document.getElementById("showTime").textContent =
        formatTime(
            localStorage.getItem("selectedShowTime") || ""
        );


    const premiumContainer =
        document.getElementById("premiumSeats");

    const classicContainer =
        document.getElementById("classicSeats");


    try {

        const seats =
            await getSeats(showId);


        premiumContainer.innerHTML = "";
        classicContainer.innerHTML = "";


        if (!seats || seats.length === 0) {

            premiumContainer.innerHTML =
                "<p>No seats available.</p>";

            return;
        }


        /*
         * Group seats according to row
         */

        const rows = {};


        seats.forEach(seat => {

            const seatNumber =
                seat.seat?.seatNumber || seat.id;

            const row =
                String(seatNumber).charAt(0);

            if (!rows[row]) {
                rows[row] = [];
            }

            rows[row].push(seat);

        });


        /*
         * Sort rows A → Y
         */

        Object.keys(rows)
            .sort()
            .forEach(rowLetter => {

                const rowSeats =
                    rows[rowLetter]
                        .sort((a, b) => {

                            const aNumber =
                                parseInt(
                                    String(
                                        a.seat?.seatNumber || a.id
                                    ).substring(1)
                                );

                            const bNumber =
                                parseInt(
                                    String(
                                        b.seat?.seatNumber || b.id
                                    ).substring(1)
                                );

                            return aNumber - bNumber;

                        });


                /*
                 * Create row
                 */

                const rowContainer =
                    document.createElement("div");

                rowContainer.className =
                    "seat-row";


                /*
                 * Row label
                 */

                const rowLabel =
                    document.createElement("div");

                rowLabel.className =
                    "row-label";

                rowLabel.textContent =
                    rowLetter;


                rowContainer.appendChild(
                    rowLabel
                );


                /*
                 * Seat area
                 */

                const seatArea =
                    document.createElement("div");

                seatArea.className =
                    "seat-area";


                rowSeats.forEach(
                    (seat, index) => {

                        const button =
                            document.createElement("button");


                        button.className =
                            "seat";


                        const seatName =
                            seat.seat?.seatNumber ||
                            seat.id;


                        button.textContent =
                            seatName.substring(1)
                                .padStart(2, "0");


                        /*
                         * Middle aisle
                         */

                        if (index === 5) {

                            const aisle =
                                document.createElement("div");

                            aisle.className =
                                "seat-aisle";

                            seatArea.appendChild(
                                aisle
                            );
                        }


                        /*
                         * Booked / available
                         */

                        if (seat.booked) {

                            button.classList.add(
                                "booked"
                            );

                            button.disabled = true;

                        } else {

                            button.classList.add(
                                "available"
                            );


                            button.onclick =
                                function () {

                                    toggleSeat(
                                        seat,
                                        button
                                    );

                                };

                        }


                        seatArea.appendChild(
                            button
                        );

                    }
                );


                rowContainer.appendChild(
                    seatArea
                );


                /*
                 * A-E = Premium
                 * F-Y = Classic
                 */

                if (
                    ["A", "B", "C", "D", "E"]
                        .includes(rowLetter)
                ) {

                    premiumContainer.appendChild(
                        rowContainer
                    );

                } else {

                    classicContainer.appendChild(
                        rowContainer
                    );

                }

            });

    }

    catch (error) {

        console.error(error);

        premiumContainer.innerHTML =
            "<p>Unable to load seats.</p>";

    }

}

function formatTime(time) {

    if (!time) return "";

    const [hours, minutes] =
        time.split(":");

    const date = new Date();

    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =====================================================
// TOGGLE SEAT
// =====================================================

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


    /*
     * REMOVE SEAT
     */

    if (index !== -1) {

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


        updateSeatSummary();

        return;

    }


    /*
     * MAXIMUM SEAT CHECK
     */

    if (
        selectedSeats.length >=
        maximumSeats
    ) {

        alert(
            `You selected ${maximumSeats} seat(s). Please choose only ${maximumSeats}.`
        );

        return;

    }


    /*
     * SELECT SEAT
     */

    selectedSeats.push(
        seat
    );


    button.classList.remove(
        "available"
    );


    button.classList.add(
        "selected"
    );


    updateSeatSummary();

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSeatSummary() {

    const names =
        selectedSeats.map(
            seat =>
                seat.seat?.seatNumber ||
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


    /*
     * Enable Continue button
     * only when the requested
     * number of seats is selected.
     */

    const continueButton =
        document.getElementById(
            "continueBookingBtn"
        );


    if (
        selectedSeats.length ===
        maximumSeats
    ) {

        continueButton.disabled =
            false;

        continueButton.classList.add(
            "ready"
        );

    }

    else {

        continueButton.disabled =
            true;

        continueButton.classList.remove(
            "ready"
        );

    }

}


// =====================================================
// CONTINUE TO BOOKING
// =====================================================

function continueToBooking() {

    if (
        selectedSeats.length === 0
    ) {

        alert(
            "Please select your seats."
        );

        return;

    }


    if (
        selectedSeats.length !==
        maximumSeats
    ) {

        alert(
            `Please select exactly ${maximumSeats} seat(s).`
        );

        return;

    }


    localStorage.setItem(
        "selectedSeatIds",

        JSON.stringify(
            selectedSeats.map(
                seat =>
                    seat.id
            )
        )
    );


    localStorage.setItem(
        "selectedSeatNames",

        JSON.stringify(
            selectedSeats.map(
                seat =>
                    seat.seat?.seatNumber ||
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


// =====================================================
// TIME FORMATTER
// =====================================================

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