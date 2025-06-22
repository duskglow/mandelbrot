# Mandelbrot Viewer

This project is an Express.js application that serves a Mandelbrot set viewer. The frontend consists of a canvas covering most of the screen and a vertical control panel on the left. All JavaScript logic is separated into .js files. Async/await is used for all asynchronous code. No user-facing API or authentication is present.

## Note

This application was vibe-coded.  Even though the author is a professional software developer/system admin, this was a deliberate (and successful) experiment in vibe coding using github copilot.  Not one line of code was written directly, and many of the prompts are recorded in the transcript above (though not perfectly because copilot decided what I wanted...)

I have lots of thoughts on vibe-coding, but they come down to:  don't try it unless you know enough about coding to understand what copilot is doing and how to corral it in the right direction.  Otherwise, you're in a world of hurt.  Nonetheless, here's a cool application that took me about an hour to write.  Enjoy.  Pull requests and issues welcome, though I'm not sure why you'd bother.

I've licensed this MIT because I didn't actually directly write any of the code, and, well, I don't carea about it too much.  Keeping this and the other .md files is strongly encouraged, though.

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
