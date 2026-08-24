// App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { TabsProvider } from './context/TabsContext';
import { ChatProvider } from './context/ChatContext';
import PushNotificationPrompt from './components/PushNotificationPrompt';
import { ThemeProvider } from './context/ThemeContext';

const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
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
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div>Chargement...</div>}>
                <AdminPage />
              </Suspense>
            }
          />
          </Routes>
        </ChatProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;


