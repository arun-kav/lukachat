import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useChatContext } from '../contexts/ChatContext';
import { setEventId, clearChat } from '../store/chatSlice';

const EventSelector = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { eventId, updateEventId } = useChatContext();

  // Mock events for now - in production, fetch from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
        
        setEvents(mockEvents);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelect = (selectedEventId) => {
    if (selectedEventId === eventId) return;
    
    dispatch(clearChat());
    dispatch(setEventId(selectedEventId));
    updateEventId(selectedEventId);
  };

  if (loading) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Events</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Events</h2>
        <div className="text-red-600 text-sm">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="block mt-2 text-primary-600 hover:text-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Events</h2>
      
      <div className="space-y-2">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => handleEventSelect(event.id)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              eventId === event.id
                ? 'bg-primary-50 border-primary-200 text-primary-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium truncate">{event.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  event.status === 'live' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                <span className="text-xs text-gray-500 capitalize">
                  {event.status}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {event.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {event.participants} participants
              </span>
              {eventId === event.id && (
                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                  Active
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-white rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Create Event</h4>
        <p className="text-sm text-gray-600 mb-3">
          Want to host your own live chat event?
        </p>
        <button className="w-full px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 text-sm font-medium">
          Create Event
        </button>
      </div>
    </div>
  );
};

export default EventSelector;