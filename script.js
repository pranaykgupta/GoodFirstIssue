const toggleButton = document.getElementById("darkModeToggle");
const body = document.body;

// Check localStorage for saved mode
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
}

// Toggle Dark Mode & Save Preference
toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});
