import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, TextField, Box } from '@mui/material';

function Products() {
  const [products, setProducts] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const handleBid = async (productId) => {
    const amount = bidAmounts[productId];
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    try {
      await axios.post('http://localhost:5000/api/bid',
        { productId, amount, userName },
        { headers: { Authorization: token }}
      );
      alert('Bid Placed Successfully!');
      window.location.reload();
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleBidChange = (productId, value) => {
    setBidAmounts({...bidAmounts, [productId]: value });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>Live Auctions</Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card className="product-card" sx={{ maxWidth: 345, m: 2 }}>
             <CardMedia
  component="img"
  height="140"
  image={product.imageUrl}
  alt={product.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/500x500/3b82f6/ffffff?text=iPhone+15+Pro';
  }}
/>
              <CardContent>
                <Typography gutterBottom variant="h5">{product.name}</Typography>
                <Typography variant="body2">{product.description}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Current Bid: ₹{product.currentBid}
                </Typography>
                <Typography variant="body2">
                  Winner: {product.highestBidder || "No bids yet"}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    size="small"
                    type="number"
                    label="Your Bid"
                    value={bidAmounts[product._id] || ''}
                    onChange={(e) => handleBidChange(product._id, e.target.value)}
                    sx={{ mr: 1, width: '120px' }}
                  />
                  <Button
                    variant="contained"
                    className="bid-button"
                    onClick={() => handleBid(product._id)}
                  >
                    Place Bid
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Products;