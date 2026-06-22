import { faker } from '@faker-js/faker';
import { pool } from './db';
import { STATUSES } from './schemas';

const ideaPrompts = [
  { title: 'A habit tracker that rewards streaks', description: 'Turn daily habits into a visible streak, with small rewards for staying consistent.' },
  { title: 'A map of quiet cafes good for working', description: 'Crowdsource cafes ranked by noise, outlets, and wifi for focused remote work.' },
  { title: 'An app that turns recipes into shopping lists', description: 'Paste any recipe and get an organized grocery list grouped by aisle.' },
  { title: 'A browser extension that summarizes long articles', description: 'Condense long reads into a few key points without leaving the page.' },
  { title: 'A tool that flags unused subscriptions', description: 'Scan recurring charges and highlight the ones you have not used in months.' },
  { title: 'A language app built around song lyrics', description: 'Learn vocabulary and grammar from songs you already love.' },
  { title: 'A journaling app that asks one question a day', description: 'A single thoughtful prompt each day to build a low-effort journaling habit.' },
  { title: 'A marketplace for borrowing tools between neighbors', description: 'Lend and borrow drills, ladders, and gear instead of buying them once.' },
  { title: 'A plant-care reminder with photo diagnosis', description: 'Get watering reminders and spot plant problems from a quick photo.' },
  { title: 'A budget app that visualizes spending as a garden', description: 'Healthy spending grows the garden; overspending makes it wilt.' },
  { title: 'A podcast that explains one science paper per episode', description: 'Make a single research paper understandable in fifteen minutes.' },
  { title: 'A platform matching mentors with career changers', description: 'Pair people switching fields with mentors who already made the jump.' },
  { title: 'An app that gamifies decluttering your home', description: 'Daily small decluttering quests with progress you can see.' },
  { title: 'A travel planner that builds itineraries from a mood', description: 'Describe the vibe you want and get a matching trip plan.' },
  { title: 'A bug-bounty practice playground for new testers', description: 'A safe app full of planted vulnerabilities for testers to find.' },
  { title: 'A tool that turns meeting notes into action items', description: 'Drop in messy notes and get a clean list of who does what by when.' },
  { title: 'A reading app that recommends the next book by feeling', description: 'Pick your next read by the mood you want, not just the genre.' },
  { title: 'A community fridge locator for a city', description: 'Map free community fridges so surplus food reaches people who need it.' },
  { title: 'An accessibility checker for small business websites', description: 'A simple report card on contrast, alt text, and keyboard navigation.' },
  { title: 'A focus timer paired with ambient sounds', description: 'Focus sessions matched with rain, cafe, or forest backgrounds.' },
  { title: 'A recipe app that cooks around your fridge', description: 'Enter what you have and get recipes that use it up.' },
  { title: 'A flashcard app that schedules reviews automatically', description: 'Spaced repetition that decides what to show you and when.' },
  { title: 'A platform for swapping skills instead of money', description: 'Trade an hour of design for an hour of coding, no cash involved.' },
  { title: 'A dashboard tracking your local air quality', description: 'See real-time air quality for your street and get alerts on bad days.' },
  { title: 'A writing app that hides the text you already wrote', description: 'Only the current line is visible, to quiet your inner editor.' },
  { title: 'A tool that turns CSV files into shareable charts', description: 'Upload a spreadsheet and get a clean chart with a shareable link.' },
  { title: 'An app that suggests micro-volunteering tasks nearby', description: 'Small, one-off ways to help in your area when you have a spare hour.' },
  { title: 'A sleep tracker that times your alarm to your cycle', description: 'Wake during light sleep within a window so mornings feel easier.' },
  { title: 'A board-game finder by group size and time', description: 'Tell it how many players and how long, and it picks the right game.' },
  { title: 'A portfolio site generator for career switchers', description: 'Turn a new skill set and projects into a clean portfolio in minutes.' },
];

async function seed() {
  // Reset the table so re-running gives a clean, reproducible dataset
  await pool.query('TRUNCATE TABLE ideas RESTART IDENTITY');

  for (const idea of ideaPrompts) {
    const status = faker.helpers.arrayElement(STATUSES);
    const createdAt = faker.date.past();
    await pool.query(
      'INSERT INTO ideas (title, description, status, created_at) VALUES ($1, $2, $3, $4)',
      [idea.title, idea.description, status, createdAt]
    );
  }

  console.log(`Seeded ${ideaPrompts.length} ideas.`);
}

seed()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());