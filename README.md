# GoodFirstIssue
Great Open Source Contributions Finder 🔍💻

A web application that helps users find amazing open-source contributions by filtering projects by programming language.
This project aims to make discovering and contributing to open-source projects easier for developers, especially beginners.

Features

Filter open-source projects by programming language
View project details and contribution opportunities
Simple and responsive interface (UI improvements needed)
Loading spinner while fetching data

⚠️ Note: Some functionalities may need improvements (e.g., displaying results after spinner, layout styling).

├── css/                  # Stylesheets for the web page
├── authenticate.js       # Handles authentication/login
├── fetchdata.js          # Handles API requests and data fetching
├── index.html            # Main HTML page
├── package.json          # Project dependencies
├── README.md             # Project documentation
├── spec.md               # Project specifications
├── .gitignore            # Git ignore file
├── .async.js.swp         # Swap file (temporary)
└── node_modules/         # Node dependencies

Installation & Setup

Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>


Install dependencies
npm install


Run the project
Open index.html in your browser

Or run a local server if needed (e.g., with live-server)

Usage

Select a programming language from the dropdown
Click Next to fetch projects
Wait for the loading spinner
View the projects (currently some display issues may occur)

Contributing

Contributions are welcome! Here are ways you can help:
Fix UI/UX issues (layout, spinner, filters)
Improve the code structure and readability
Add error handling for failed API calls
Update documentation and project instructions

Steps to contribute:
Fork the repository

Create a branch for your change:
git checkout -b feature/fix-ui

Make your changes and commit:
bash
Copy code
git commit -m "Fix layout and improve spinner"
Push to your fork and open a Pull Request

Future Enhancements

Make the UI fully responsive and visually appealing
Add sorting and advanced filtering options
Show error messages when API fails or no results found
Integrate more APIs for open-source projects

Tech Stack

HTML, CSS, JavaScript
Node.js for dependencies
API-based project fetching

Acknowledgements

Inspired by the need to make open-source contributions easier for beginners
Thanks to the GitHub community for project ideas and APIs
