const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));
mongoose.connect('mongodb://localhost:27017/auction_db')
 .then(() => console.log('MongoDB Connected'))
 .catch(err => console.log('MongoDB Error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  startingBid: Number,
  currentBid: Number,
  imageUrl: String,
  endTime: Date,
  seller: String,
  bids: [{ userName: String, amount: Number, time: { type: Date, default: Date.now } }]
});
const Product = mongoose.model('Product', productSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, 'mySecretKey123', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/seed-products', async (req, res) => {
  try {
    await Product.deleteMany({});
const realProducts = [
  { name: 'Gaming Laptop RTX 4070', description: 'High performance gaming laptop with RTX 4070 & 16GB RAM', startingBid: 10000, imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500' },
  { name: 'Apple Watch Ultra', description: 'Rugged smartwatch with GPS + Cellular, 49mm titanium case', startingBid: 15000, imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500' },
  { name: 'Sony Camera A7', description: 'Full-frame mirrorless camera, 24.2MP with 4K video', startingBid: 20000, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500' },
  { name: 'PlayStation 5', description: 'Next-gen gaming console with DualSense controller', startingBid: 25000, imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500' },
  { name: 'MacBook Air M2', description: 'Supercharged by M2 chip, 13.6-inch Liquid Retina display', startingBid: 30000, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500' },
  { name: 'iPad Pro 12.9', description: 'M2 chip, Liquid Retina XDR display with ProMotion', startingBid: 35000, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
  { name: 'AirPods Pro', description: 'Active Noise Cancellation with Adaptive Transparency', startingBid: 40000, imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500' },
  { name: 'Samsung S24 Ultra', description: '200MP camera, S Pen, Snapdragon 8 Gen 3', startingBid: 45000, imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500' },
  { name: 'Dell XPS 15', description: 'InfinityEdge display, Intel Core i9, 32GB RAM', startingBid: 50000, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500' },
  { name: 'GoPro Hero 12', description: '5.3K video, HyperSmooth 6.0, Waterproof action camera', startingBid: 55000, imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500' },
  { name: 'Nintendo Switch', description: 'OLED Model, 7-inch screen, Enhanced audio', startingBid: 60000, imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500' },
  { name: 'Bose Headphones', description: 'QuietComfort 45, Noise cancelling over-ear headphones', startingBid: 65000, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
  { name: 'Canon EOS R5', description: '45MP full-frame, 8K video, In-body image stabilization', startingBid: 70000, imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500' },
  { name: 'Xbox Series X', description: '12 teraflops processing power, 1TB SSD, 4K gaming', startingBid: 75000, imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500' },
  { name: 'Tesla Model Car', description: 'Diecast model 1:18 scale, detailed interior', startingBid: 80000, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500' },
  { name: 'Drone DJI Mini 4', description: '4K HDR video, 34-min flight time, Under 249g', startingBid: 85000, imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500' },
  { name: 'Smart TV 65 Inch', description: '4K QLED, Dolby Vision, Google TV built-in', startingBid: 90000, imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500' },
  { name: 'Mechanical Keyboard', description: 'RGB backlit, Blue switches, Hot-swappable', startingBid: 95000, imageUrl: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=500' },
  { name: 'Gaming Mouse Pro', description: '25K DPI, 11 programmable buttons, 80hr battery', startingBid: 100000, imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500' }
];
    const productsToInsert = realProducts.map(p => ({
     ...p, currentBid: p.startingBid, endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), seller: 'Admin', bids: []
    }));
    await Product.insertMany(productsToInsert);
    res.json({ msg: '20 Products added with all working images ✅' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error seeding products' });
  }
});

app.post('/api/bid/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { bidAmount, userName } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (bidAmount <= product.currentBid) return res.status(400).json({ msg: 'Bid must be higher' });
    product.currentBid = bidAmount;
    product.bids.push({ userName, amount: bidAmount, time: new Date() });
    await product.save();
    res.json({ msg: 'Bid placed successfully', product });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/', (req, res) => { res.send('Backend API is running'); });
const PORT = 5000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });