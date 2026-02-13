// Header Component
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1>AssetTrackPro</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/assets">Assets</a></li>
            <li><a href="/reports">Reports</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
