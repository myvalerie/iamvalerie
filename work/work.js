const projects = [
  {
    kicker: 'Predictive analytics',
    title: 'Bank Marketing Prediction Model',
    text: 'A modelling-focused project that highlights how predictive analytics can be presented with clarity, structure, and visual polish rather than raw technical clutter.',
    points: [
      'Pattern discovery through outcome-oriented data interpretation',
      'A more elegant way to present model thinking to public viewers',
      'Visual language inspired by structured analytical systems'
    ]
  },
  {
    kicker: 'Segmentation strategy',
    title: 'Customer Segmentation Study',
    text: 'An interactive showcase built around cluster thinking, grouping behaviour and characteristics into a cleaner, more compelling story about audience differences.',
    points: [
      'Segment-led analysis translated into a visual identity system',
      'A restrained but dynamic presentation of data relationships',
      'Designed to feel premium, not like a dashboard template'
    ]
  },
  {
    kicker: 'Visual dashboard',
    title: 'Data Visualisation Experience',
    text: 'A presentation-oriented project showing how visualisation can become part of a polished narrative, combining insight, hierarchy, and motion-led interface details.',
    points: [
      'Clear emphasis on hierarchy and interpretation',
      'Data-inspired visuals without unnecessary density',
      'Motion cues that support attention and flow'
    ]
  }
];

const tabs = document.querySelectorAll('.work-tab');
const title = document.getElementById('projectTitle');
const kicker = document.getElementById('projectKicker');
const text = document.getElementById('projectText');
const points = document.getElementById('projectPoints');
const graphics = document.querySelectorAll('.project-graphic');

function renderProject(index) {
  const project = projects[index];
  if (!project) return;

  kicker.textContent = project.kicker;
  title.textContent = project.title;
  text.textContent = project.text;
  points.innerHTML = project.points.map((item) => `<li>${item}</li>`).join('');

  tabs.forEach((tab, tabIndex) => tab.classList.toggle('is-active', tabIndex === index));
  graphics.forEach((graphic, graphicIndex) => graphic.classList.toggle('is-active', graphicIndex === index));
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    renderProject(Number(tab.dataset.project));
  });
});

renderProject(0);
