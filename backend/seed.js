const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Product = require("./models/Product");

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 89.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/headphones/300/200",
    rating: 4.5,
    stock: 50,
    isFeatured: true,
  },
  {
    name: "Smart Watch Series 5",
    description: "Latest smart watch with heart rate monitoring, GPS, and water-resistant design.",
    price: 199.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/smartwatch/300/200",
    rating: 4.7,
    stock: 30,
    isFeatured: true,
  },
  {
    name: "Cotton T-Shirt - Men's",
    description: "Comfortable 100% cotton t-shirt available in multiple sizes and colors.",
    price: 19.99,
    category: "Clothing",
    image: "https://picsum.photos/seed/tshirt/300/200",
    rating: 4.2,
    stock: 100,
    isFeatured: false,
  },
  {
    name: "Denim Jeans - Women's",
    description: "Classic fit denim jeans with stretch fabric for comfort and durability.",
    price: 49.99,
    category: "Clothing",
    image: "https://picsum.photos/seed/jeans/300/200",
    rating: 4.0,
    stock: 75,
    isFeatured: false,
  },
  {
    name: "Python Programming Guide",
    description: "Comprehensive guide to Python programming for beginners and intermediate developers.",
    price: 29.99,
    category: "Books",
    image: "https://picsum.photos/seed/pythonbook/300/200",
    rating: 4.8,
    stock: 20,
    isFeatured: true,
  },
  {
    name: "The Great Novel",
    description: "Award-winning fiction novel that explores themes of love and loss.",
    price: 14.99,
    category: "Books",
    image: "https://picsum.photos/seed/novel/300/200",
    rating: 4.6,
    stock: 15,
    isFeatured: false,
  },
  {
    name: "Coffee Maker Deluxe",
    description: "Automatic coffee maker with programmable timer and built-in grinder.",
    price: 79.99,
    category: "Home & Kitchen",
    image: "https://picsum.photos/seed/coffeemaker/300/200",
    rating: 4.3,
    stock: 40,
    isFeatured: true,
  },
  {
    name: "Non-Stick Cookware Set",
    description: "10-piece cookware set with non-stick coating and heat-resistant handles.",
    price: 89.99,
    category: "Home & Kitchen",
    image: "https://picsum.photos/seed/cookware/300/200",
    rating: 4.4,
    stock: 25,
    isFeatured: false,
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} products. Skipping seed.`);
      await mongoose.disconnect();
      return;
    }

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products`);
    
    // Disconnect
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding products:", error);
    await mongoose.disconnect();
  }
};

seedProducts();