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
    let url = `/theatres?city=${encodeURIComponent(city)}`;

    if (movieId) {
        url += `&movieId=${movieId}`;
    }

    return await apiRequest(url);
}


async function getShows(movieId, theatreId) {
    let url = `/shows?movieId=${movieId}`;

    if (theatreId) {
        url += `&theatreId=${theatreId}`;
    }

    return await apiRequest(url);
}


async function getSeats(showId) {
    return await apiRequest(`/seats?showId=${showId}`);
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