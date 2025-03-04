
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import Sidebar from './components/Sidebar';
import TextEditor from './components/TextEditor';
import FileTabs from './components/FileTabs';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="flex h-screen bg-white">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <FileTabs />
            <TextEditor />
          </main>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
