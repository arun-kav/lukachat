import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ChatProvider } from './contexts/ChatContext';
import EventSelector from './components/EventSelector';
import ChatWindow from './components/ChatWindow';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <ChatProvider>
        <div className="h-screen flex bg-gray-100">
          {/* Main Chat Area */}
          <ChatWindow />
          
          {/* Sidebar */}
          <EventSelector />
        </div>
      </ChatProvider>
    </Provider>
  );
}

export default App;
