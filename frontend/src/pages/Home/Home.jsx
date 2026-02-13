// Home Page
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to AssetTrackPro</h1>
      <p>Manage your assets efficiently and effectively</p>
      <div className="features">
        <div className="feature-card">
          <h3>Track Assets</h3>
          <p>Keep track of all your company assets in one place</p>
        </div>
        <div className="feature-card">
          <h3>Generate Reports</h3>
          <p>Create detailed reports on asset usage and status</p>
        </div>
        <div className="feature-card">
          <h3>Manage Inventory</h3>
          <p>Easily manage and update your asset inventory</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
