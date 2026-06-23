import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBids, setShowBids] = useState({}); // Track which product bids are open
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handlePlaceBid = async (productId) => {
    const bidAmount = prompt('Enter your bid amount:');
    if (!bidAmount || isNaN(bidAmount)) {
      alert('Please enter a valid number');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/bid/${productId}`, {
        bidAmount: Number(bidAmount),
        userName: username
      });
      alert('Bid placed successfully!');
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.msg || 'Error placing bid');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const toggleBids = (productId) => {
    setShowBids(prev => ({...prev, [productId]:!prev[productId] }));
  };

  if (loading) return <h2 style={{ textAlign: 'center', color: 'white' }}>Loading...</h2>;

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      {/* Navbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155'
      }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>Auction App</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'white' }}>Welcome, {username}!</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              backgroundColor: '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: '#38bdf8', marginBottom: '30px' }}>
          Live Auction Products
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {products.map((product) => (
            <div key={product._id} style={{
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              padding: '15px',
              border: '1px solid #334155'
            }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/400x300/1e293b/38bdf8?text=${encodeURIComponent(product.name)}`;
                }}
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              />

              <h3 style={{ color: 'white', margin: '10px 0' }}>{product.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', minHeight: '40px' }}>
                {product.description}
              </p>

              <div style={{ margin: '15px 0' }}>
                <p style={{ color: '#38bdf8', fontWeight: 'bold', margin: '5px 0' }}>
                  Current Bid: ₹{product.currentBid}
                </p>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '5px 0' }}>
                  Winner: {product.bids.length > 0? product.bids[product.bids.length - 1].userName : 'No bids yet'}
                </p>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '5px 0' }}>
                  Total Bids: {product.bids.length}
                </p>
              </div>

              <button
                onClick={() => handlePlaceBid(product._id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#ec4899',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                PLACE BID
              </button>

              {/* Show Bids Button */}
              <button
                onClick={() => toggleBids(product._id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#334155',
                  color: '#38bdf8',
                  border: '1px solid #38bdf8',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {showBids[product._id]? 'Hide Bids' : 'Show All Bids'}
              </button>

              {/* Bids List */}
              {showBids[product._id] && (
                <div style={{
                  marginTop: '15px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: '#0f172a',
                  padding: '10px',
                  borderRadius: '8px'
                }}>
                  {product.bids.length === 0? (
                    <p style={{ color: '#64748b', textAlign: 'center' }}>No bids yet</p>
                  ) : (
                    product.bids.slice().reverse().map((bid, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px',
                        borderBottom: '1px solid #334155',
                        color: '#cbd5e1'
                      }}>
                        <span>{bid.userName}</span>
                        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>₹{bid.amount}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;