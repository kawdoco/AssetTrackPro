import { Header, Footer } from './components';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
