const profilePanel = document.querySelector('.profile-panel');
const avatar = document.querySelector('.profile-avatar');

if (profilePanel && avatar) {
  profilePanel.addEventListener('mousemove', (event) => {
    const rect = profilePanel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
    avatar.style.transform = `translate(${x}px, ${y}px) rotateY(${x * 0.9}deg) rotateX(${-y * 0.9}deg)`;
  });

  profilePanel.addEventListener('mouseleave', () => {
    avatar.style.transform = 'translate(0, 0) rotateY(0deg) rotateX(0deg)';
  });
}
