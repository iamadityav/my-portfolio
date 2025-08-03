// src/components/CodePlayground.jsx
// This component has been refactored into a JavaScript-only code playground.
// It features a code editor on the left, an output console on the right,
// and a "Run" button to execute the code.

import { useState } from 'react'; // Import React and the useState hook for managing state.
import { motion } from 'framer-motion'; // Import motion for animations.

function CodePlayground() {
  // Define the accent color for a consistent theme.
  const accentColor = '#3abf00';

  // State to hold the code written by the user in the editor.
  const [code, setCode] = useState('// Write your JavaScript code here\nconsole.log("Hello, World!");');
  // State to hold the output from the executed code.
  const [output, setOutput] = useState('');

  // Define the maximum number of characters allowed in the code editor.
  const codeLimit = 1500;

  // Function to handle the execution of the JavaScript code.
  const handleRunCode = () => {
    // Clear previous output before running new code.
    setOutput('');

    // A simple, client-side sandboxing approach to capture console output.
    let capturedOutput = '';
    const originalConsoleLog = console.log;

    // Override console.log to capture its output to a string.
    console.log = (...args) => {
      capturedOutput += args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ') + '\n';
    };

    // Use a try-catch block to gracefully handle any errors in the user's code.
    try {
      // Create a new Function to execute the code safely within a new scope.
      // This is a safer alternative to eval(), as it doesn't have access to the local scope.
      const func = new Function(code);
      func(); // Execute the user's code.
    } catch (error) {
      // If an error occurs, capture it and add it to the output.
     capturedOutput += `Error: ${(error as Error).message}`;
    } finally {
      // Restore the original console.log function.
      console.log = originalConsoleLog;
      // Set the captured output to the state for display.
      setOutput(capturedOutput);
    }
  };

  return (
    // Main section container for the playground.
    <section id="code-playground" className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-8" style={{ color: accentColor }}>JavaScript Playground</h2>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        {/* Left side: Code Editor */}
        <div className="flex flex-col w-full lg:w-1/2">
          <div className="bg-gray-900 rounded-lg p-4 shadow-lg flex-grow relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 bg-transparent text-white font-mono text-sm resize-none outline-none"
              style={{ color: accentColor }}
              placeholder="// Start coding here..."
              maxLength={codeLimit} // Enforce the character limit.
            />
            {/* Character counter to show the user their progress against the limit. */}
            <div className="absolute bottom-2 right-4 text-xs" style={{ color: accentColor }}>
              {code.length} / {codeLimit}
            </div>
          </div>
        </div>

        {/* Right side: Output Console */}
        <div className="flex flex-col w-full lg:w-1/2">
          {/* The "Run" button to execute the code. The background color is now set using inline style for guaranteed rendering. */}
          <motion.button
            onClick={handleRunCode}
            className={`
              w-full px-6 py-3 rounded-lg font-semibold shadow-md mb-4
              transition-colors duration-300 text-black hover:bg-[${accentColor}]/90
            `}
            style={{ backgroundColor: accentColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Run Code
          </motion.button>
          
          <div className="bg-gray-900 rounded-lg p-4 shadow-lg flex-grow overflow-y-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {output || 'Output will be displayed here.'}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodePlayground;
