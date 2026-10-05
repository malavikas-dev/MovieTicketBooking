async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        {
            ...options,
            headers: headers
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `HTTP Error ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    return await response.text();
}


async function getMovies(city = "") {
    let url = "/movies";

    if (city) {
        url += `?city=${encodeURIComponent(city)}`;
    }

    return await apiRequest(url);
}


async function getMovie(movieId) {
    return await apiRequest(`/movies/${movieId}`);
}



async function getTheatres(city, movieId) {
    const url = `/theatres/city/${encodeURIComponent(city || "Kochi")}`;

    console.log("Requesting:", API_CONFIG.BASE_URL + url);

    const result = await apiRequest(url);

    console.log("Theatre response:", result);

    return result;
}


async function getShows(movieId, theatreId) {
    let url = `/showtimes?movieId=${movieId}`;

    if (theatreId) {
        url += `&theatreId=${theatreId}`;
    }

    return await apiRequest(url);
}


async function getSeats(showId) {
    return await apiRequest(`/showtime-seats/showtime/${showId}`);
}

async function createBooking(data) {
    return await apiRequest("/bookings", {
        method: "POST",
        body: JSON.stringify(data)
    });
}


async function loginUser(data) {
    return await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    });
}


async function registerUser(data) {
    return await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
}


async function getBookingHistory(userId) {
    return await apiRequest(`/bookings/user/${userId}`);
}

async function createPayment(data) {
    return await apiRequest("/payments", {
        method: "POST",
        body: JSON.stringify(data)
    });
}