document.addEventListener(
    "DOMContentLoaded",
    loadShows
);


// ================= LOAD SHOWS =================

async function loadShows() {

    const movieId =
        localStorage.getItem(
            "selectedMovieId"
        );


    const theatreId =
        localStorage.getItem(
            "selectedTheatreId"
        );


    const showList =
        document.getElementById(
            "showList"
        );


    try {

        const shows =
            await getShows(
                movieId,
                theatreId
            );


        showList.innerHTML = "";


        if (
            !shows ||
            shows.length === 0
        ) {

            showList.innerHTML = `
                <div class="no-shows">
                    <h3>No shows available</h3>
                    <p>Please try another theatre or date.</p>
                </div>
            `;

            return;
        }


        /*
         * GROUP SHOWS BY THEATRE
         */

        const theatres = {};


        shows.forEach(show => {

            const theatreName =
                show.theatre?.name ||
                "Theatre";


            if (!theatres[theatreName]) {

                theatres[theatreName] = [];

            }


            theatres[theatreName].push(
                show
            );

        });


        /*
         * CREATE THEATRE CARDS
         */

        Object.keys(theatres).forEach(
            theatreName => {

                const theatreShows =
                    theatres[theatreName];


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "theatre-show-card";


                /*
                 * DATE
                 */

                const date =
                    theatreShows[0]
                        .showDate ||
                    "";


                /*
                 * CREATE SHOW BUTTONS
                 */

                let showButtons = "";


                theatreShows.forEach(
                    show => {

                        const formattedTime =
                            formatTime(
                                show.showTime
                            );


                        const price =
                            show.ticketPrice ||
                            0;


                        showButtons += `

                            <button
                                class="show-time-btn"
                                onclick="selectShow(
                                    ${show.id},
                                    '${show.showTime}',
                                    ${price}
                                )">

                                <span class="show-time">
                                    ${formattedTime}
                                </span>

                                <span class="show-price">
                                    ₹${price}
                                </span>

                            </button>

                        `;

                    }
                );


                card.innerHTML = `

                    <div class="theatre-info">

                        <div class="theatre-logo">
                            PVR
                        </div>

                        <div>

                            <h3>
                                ${theatreName}
                            </h3>

                            <p>
                                Non-cancellable
                            </p>

                        </div>

                    </div>


                    <div class="theatre-icons">

                        <span title="Food & Beverages">
                            🍿
                        </span>

                        <span title="M-Ticket">
                            🎟️
                        </span>

                    </div>


                    <div class="show-date">

                        <span>
                            ${formatDate(date)}
                        </span>

                    </div>


                    <div class="show-times">

                        ${showButtons}

                    </div>

                `;


                showList.appendChild(
                    card
                );

            }
        );

    }


    catch (error) {

        console.error(
            "Showtime error:",
            error
        );


        showList.innerHTML = `

            <div class="no-shows">

                <h3>
                    Unable to load showtimes
                </h3>

                <p>
                    Please check whether the backend is running.
                </p>

            </div>

        `;

    }

}


// ================= SELECT SHOW =================

function selectShow(
    showId,
    showTime,
    price
) {

    localStorage.setItem(
        "selectedShowId",
        showId
    );


    localStorage.setItem(
        "selectedShowTime",
        showTime
    );


    localStorage.setItem(
        "selectedTicketPrice",
        price
    );


    window.location.href =
        "seats.html";

}


// ================= FORMAT TIME =================

function formatTime(time) {

    if (!time) {
        return "";
    }


    const parts =
        time.split(":");


    let hours =
        parseInt(parts[0]);


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


// ================= FORMAT DATE =================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    const day =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "short"
            }
        );


    const dateNumber =
        date.getDate();


    const month =
        date.toLocaleDateString(
            "en-US",
            {
                month: "short"
            }
        );


    return `${day} ${dateNumber} ${month}`;

}