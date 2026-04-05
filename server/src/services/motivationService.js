const messages = [
  'Small progress is still progress. Keep going!',
  'Discipline beats motivation—show up for this next block.',
  'You are building momentum one task at a time.',
  'Your future self will thank you for this focus session.'
];

export const randomMotivation = () => messages[Math.floor(Math.random() * messages.length)];
