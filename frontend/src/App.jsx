// App.jsx
import MainLayout from './layouts/MainLayout';
import { TabsProvider } from './context/TabsContext';

function App() {
  return (
    <TabsProvider>
      <MainLayout />
    </TabsProvider>
  );
}

export default App;
