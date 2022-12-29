// Get random number between intervals
export function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Get random color in hex
export function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Get (x, y) coordinates
export function getXY({ mag, dir }) {
  return {
    x: Math.cos(dir) * mag,
    y: Math.sin(dir) * mag,
  };
}

// Get the vector distance from the center
export function getMagnitude({ x, y }) {
  return Math.hypot(x, y);
}

// Get direction in radians (0 to π)
export function getDirectionInRadians({ x, y }) {
  return Math.atan2(y, x);
}

// Get direction in degree (-180 to 180°)
export function getDirectionInDegrees({ x, y }){
  return getDirectionInRadians({ x, y }) * 180 / Math.PI;
}