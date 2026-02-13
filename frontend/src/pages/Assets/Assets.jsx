// Assets Page
import { useState, useEffect } from 'react';
import './Assets.css';

const Assets = () => {
  const [assets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchAssets = async () => {
      // TODO: Fetch assets from API
      setLoading(false);
    };
    
    fetchAssets();
  }, []);

  if (loading) {
    return <div className="assets-page">Loading...</div>;
  }

  return (
    <div className="assets-page">
      <div className="assets-header">
        <h1>Assets</h1>
        <button className="btn-add">Add Asset</button>
      </div>
      <div className="assets-list">
        {assets.length === 0 ? (
          <p>No assets found. Add your first asset to get started.</p>
        ) : (
          <table className="assets-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.status}</td>
                  <td>{asset.location}</td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Assets;
