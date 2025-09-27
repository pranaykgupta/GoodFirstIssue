const tips = [
      "Don't be afraid to ask questions! The community is here to help.",
      "Always read the project's CONTRIBUTING.md file before you start.",
      "Start with small changes, like fixing a typo in the documentation.",
      "When you create a pull request, link it to the issue you are solving.",
      "Provide clear and concise commit messages.",
      "Reviewers will give you feedback. It's a learning opportunity!",
      "Always be polite and respectful to maintainers and other contributors.",
    ];

    // Get references to the HTML elements
    const tipText = document.getElementById('tip-text');
    const newTipButton = document.getElementById('new-tip-button');

    // Function to get a random tip from the array
    function getRandomTip() {
      const randomIndex = Math.floor(Math.random() * tips.length);
      return tips[randomIndex];
    }

    // Function to update the tip text on the page
    function updateTip() {
      tipText.textContent = getRandomTip();
    }

    // Add an event listener to the button
    if (newTipButton) {
      newTipButton.addEventListener('click', updateTip);
    }

    // Display a random tip when the page first loads
    updateTip();
