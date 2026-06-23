import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

function MyBids() {
  const [myBids, setMyBids] = useState([]);

  useEffect(() => {
    const fetchMyBids = async () => {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName');

      const res = await axios.get('http://localhost:5000/api/mybids', {
        headers: {
          Authorization: token,
          username: userName
        }
      });
      setMyBids(res.data);
    };
    fetchMyBids();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>My Won Items</Typography>
      <Grid container spacing={3}>
        {myBids.length === 0? (
          <Typography>You haven't won any items yet.</Typography>
        ) : (
          myBids.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card className="product-card">
                <CardMedia
                  component="img"
                  height="140"
                  image={product.imageUrl}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5">{product.name}</Typography>
                  <Typography variant="body2">Won for: ₹{product.currentBid}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default MyBids;