const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
  createHeartTrail(e.clientX, e.clientY);
});

function createHeartTrail(x, y) {
  const heart = document.createElement('div');
  heart.classList.add('heart-trail');
  heart.style.top = `${y}px`;
  heart.style.left = `${x}px`;
  heart.style.backgroundColor = getRandomColor();

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1200);
}

function getRandomColor() {
  const colors = ['#ff6b6b', '#ff3b3b', '#ff9999', '#ff1e56'];
  return colors[Math.floor(Math.random() * colors.length)];
}
