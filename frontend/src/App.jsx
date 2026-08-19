// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminPage from './pages/AdminPage';
import { TabsProvider } from './context/TabsContext';
import { ChatProvider } from './context/ChatContext';
import PushNotificationPrompt from './components/PushNotificationPrompt';

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          {/* Portfolio principal pour les visiteurs */}
          <Route
            path="/"
            element={
              <TabsProvider>
                <>
                  <MainLayout />
                  <PushNotificationPrompt />
                </>
              </TabsProvider>
            }
          />
          {/* Page Admin séparée, accessible uniquement via /admin */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;


