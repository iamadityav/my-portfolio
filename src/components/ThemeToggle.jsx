// src/components/ThemeToggle.jsx
// This component provides a simple button to toggle between light and dark themes.
// It is still included for potential future use, even though the main sections
// now have a fixed black/green theme.

import React from 'react';

// ThemeToggle component receives the current theme and the function to toggle it as props.
function ThemeToggle({ theme, toggleTheme }) {
  return (
    // The button is fixed to the top-right of the screen.
    <button
      onClick={toggleTheme}
      className={`
        fixed top-4 right-4 p-3 rounded-full shadow-lg
        transition-colors duration-300 ease-in-out z-50
        ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}
      `}
    >
      {/* The button text changes based on the current theme. */}
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

export default ThemeToggle;
