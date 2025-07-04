// In-memory store for events
const mockEvents = [
  {
    id: 'tech-conference-2025',
    name: 'Tech Conference 2025',
    description: 'Annual technology conference covering AI, blockchain, and web development',
    status: 'live',
    participants: 245
  },
  {
    id: 'gaming-tournament',
    name: 'Esports Championship',
    description: 'Live gaming tournament with top players worldwide',
    status: 'live',
    participants: 1834
  },
  {
    id: 'music-festival',
    name: 'Summer Music Festival',
    description: 'Live music performances from various artists',
    status: 'upcoming',
    participants: 89
  },
  {
    id: 'sports-match',
    name: 'Championship Final',
    description: 'Live sports commentary and discussion',
    status: 'live',
    participants: 567
  }
];

const getEvents = (req, res) => {
  res.status(200).json(mockEvents);
};

const createEvent = (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Event name and description are required' });
  }

  const newEvent = {
    id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    name,
    description,
    status: 'upcoming',
    participants: 0
  };

  mockEvents.push(newEvent);
  res.status(201).json(newEvent);
};

module.exports = {
  getEvents,
  createEvent,
};
