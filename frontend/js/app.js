function selectCity(city) {
    localStorage.setItem("selectedCity", city);
    window.location.href = "movies.html";
}

function getSelectedCity() {
    return localStorage.getItem("selectedCity");
}