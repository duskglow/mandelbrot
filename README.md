# Mandelbrot Viewer

This project is an Express.js application that serves a Mandelbrot set viewer. The frontend consists of a canvas covering most of the screen and a vertical control panel on the left. All JavaScript logic is separated into .js files. Async/await is used for all asynchronous code. No user-facing API or authentication is present.

## Getting Started

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the server:
   ```powershell
   node index.js
   ```
3. Open your browser and go to http://localhost:3000

## Project Structure
- `index.js`: Express server setup
- `public/`: Static frontend files
  - `index.html`: Main HTML file
  - `style.css`: Styles
  - `js/mandelbrot.js`: Mandelbrot rendering logic
  - `js/panel.js`: Control panel logic

## Security
- Uses Helmet for basic HTTP header security best practices.

## License
MIT
