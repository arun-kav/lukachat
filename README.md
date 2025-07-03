# LukaChat Frontend

A real-time chat application built with React, Redux Toolkit, and Socket.IO for live event commentary.

## Features

- **Real-time messaging** with Socket.IO
- **Event-based chat rooms** with live participant counts
- **Typing indicators** to show when users are typing
- **User management** with customizable usernames
- **Responsive design** with Tailwind CSS
- **Connection status** indicators
- **Message history** loading
- **Rate limiting** and spam protection ready

## Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── components/           # React components
│   ├── EventSelector.jsx    # Event selection sidebar
│   ├── ChatWindow.jsx       # Main chat interface
│   ├── Message.jsx          # Individual message component
│   └── TypingIndicator.jsx  # Typing indicator
├── contexts/            # React contexts
│   └── ChatContext.jsx     # Chat context provider
├── hooks/               # Custom React hooks
│   └── useChat.js          # Socket.IO integration hook
├── services/            # External services
│   └── socket.js           # Socket.IO client configuration
├── store/               # Redux store
│   ├── index.js            # Store configuration
│   └── chatSlice.js        # Chat state management
├── styles/              # Global styles
│   └── global.css          # Tailwind imports and global styles
├── App.jsx              # Root component
└── main.jsx             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running backend server (see backend README)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment (optional):
   - Backend URL is auto-detected based on environment
   - Development: `http://localhost:3001`
   - Production: Uses current domain

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Backend Connection

The Socket.IO connection is automatically configured:
- **Development**: Connects to `http://localhost:3001`
- **Production**: Connects to the same domain as the frontend

### Vite Proxy

The development server proxies Socket.IO requests to the backend:
```javascript
server: {
  proxy: {
    '/socket.io': 'http://localhost:3001',
    '/api': 'http://localhost:3001',
  },
}
```

## Key Components

### EventSelector
- Displays available chat events
- Handles event selection and room switching
- Shows participant counts and event status

### ChatWindow
- Main chat interface with message list
- Message input with typing indicators
- Username management
- Connection status display

### useChat Hook
- Manages Socket.IO connection and events
- Handles message sending and receiving
- Manages typing indicators
- Provides connection state

### Redux Store
- Manages chat messages and state
- Handles typing users
- Tracks connection status
- Stores current event information

## Socket.IO Events

### Client → Server
- `joinRoom`: Join a specific event room
- `message`: Send a chat message
- `typing`: Indicate user is typing
- `stop_typing`: Stop typing indicator

### Server → Client
- `message`: Receive new chat message
- `history`: Receive message history
- `user_typing`: User started typing
- `user_stopped_typing`: User stopped typing
- `user_count`: Updated participant count

## User Management

- Users are automatically assigned unique IDs
- Usernames are customizable and stored locally
- User data persists across sessions

## Error Handling

- Connection errors are displayed in the UI
- Automatic reconnection attempts
- Graceful handling of network issues
- Message validation and sanitization

## Performance Optimizations

- Message history limited to last 100 messages
- Efficient re-renders with React.memo patterns
- Optimized scroll behavior
- Debounced typing indicators

## Future Enhancements

- Message reactions and emojis
- File and image sharing
- User mentions and notifications
- Message search and filtering
- Dark mode support
- Mobile app version

## Development Notes

- Built with modern React patterns (hooks, context)
- Fully responsive design
- Accessibility considerations
- TypeScript support ready
- PWA capabilities can be added

## Deployment

This frontend is designed to be deployed as static files and can be served by:
- Nginx
- Apache
- Netlify
- Vercel
- Any static hosting service

The build output is production-ready and optimized.


## TODOs

Below is a prioritized backlog of the key enhancements we’ll tackle once the MVP is up and running:

1. **Stateless Refactor & Scaling**
   - Migrate in‑memory `ringBuffer` → Redis lists for message history
   - Integrate `socket.io-redis` adapter so multiple backend instances can share rooms
   - Implement event‑sharding: route high‑volume events to dedicated workers

2. **Containerization & Orchestration**
   - Add a `Dockerfile` for both `frontend` and `backend`
   - Create Kubernetes manifests:  
     - Namespace, Deployment, Service  
     - Ingress rules (with WebSocket timeouts)  
     - HorizontalPodAutoscaler (CPU & custom metrics)

3. **CI/CD Pipeline**
   - GitHub Actions or DO App Platform to:  
     - Build and test both services  
     - Publish Docker images to registry  
     - Deploy to Kubernetes cluster automatically on `main` branch

4. **Bot Mitigation & Security**
   - Plug in hCaptcha (v3 invisible) on socket connect or after rate limits
   - Configure Cloudflare WAF / IP reputation lists  
   - Add regex/ML‑driven spam filters as a microservice

5. **Monitoring & Observability**
   - Expose Prometheus metrics (connections/sec, msgs/sec, pub/sub lag)  
   - Add health/readiness probes for backend  
   - Centralize logs to a lightweight aggregator (Papertrail, Loki, etc.)

6. **Feature Enhancements**
   - Customizable usernames & user badges  
   - Emoji reactions, polls, & message threading  
   - File/image sharing with safe‑upload scan  
   - Dark mode, accessibility improvements, PWA support  

Feel free to reorder or split these into sprints as we iterate. This list will keep us focused on transforming our MVP into a resilient, large‑scale chat platform.  
