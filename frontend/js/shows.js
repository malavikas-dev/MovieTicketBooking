document.addEventListener(
    "DOMContentLoaded",
    loadShows
);


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


        if (!shows ||
            shows.length === 0) {

            showList.innerHTML =
                "<p>No shows available.</p>";

            return;
        }


        shows.forEach(show => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "show-card";


            let timesHTML = "";


            /*
             * If backend gives multiple
             * showtimes in an array
             */

            if (
                show.showtimes &&
                Array.isArray(show.showtimes)
            ) {

                show.showtimes.forEach(
                    time => {

                        timesHTML += `

                            <button
                                class="btn"
                                onclick="selectShow(
                                    ${show.id},
                                    '${time}',
                                    ${show.price || 0}
                                )">

                                ${time}

                            </button>

                        `;
                    }
                );

            }


            /*
             * If backend gives
             * one showtime
             */

            else {

                timesHTML = `

                    <button
                        class="btn"
                        onclick="selectShow(
                            ${show.id},
                            '${show.showTime || ""}',
                            ${show.price || 0}
                        )">

                        ${show.showTime || "Select"}

                    </button>

                `;
            }


            card.innerHTML = `

                <h3>
                    ${show.theatreName || "Theatre"}
                </h3>

                <p>
                    Date:
                    ${show.date || "N/A"}
                </p>

                <p>
                    Price:
                    ₹${show.price || 0}
                </p>

                <p>
                    Discount:
                    ${show.discount || 0}%
                </p>

                <br>

                <div>
                    ${timesHTML}
                </div>

            `;


            showList.appendChild(
                card
            );

        });

    }

    catch (error) {

        console.error(error);

        showList.innerHTML =
            "<p>Unable to load showtimes.</p>";
    }
}


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