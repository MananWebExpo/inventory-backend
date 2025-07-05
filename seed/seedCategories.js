import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category';

dotenv.config();

// Sample categories for the inventory system
const categoriesData = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets including smartphones, laptops, and accessories'
  },
  {
    name: 'Clothing',
    description: 'Apparel and fashion items for men, women, and children'
  },
  {
    name: 'Books',
    description: 'Physical and digital books across various genres and subjects'
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement, furniture, and gardening supplies'
  }
];

// Seeder function
const seedCategories = async () => {
  try {
    console.log('🌱 Starting category seeding process...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product_inventory');
    console.log('📦 Connected to database');

    // Check if categories already exist
    const existingCategories = await Category.find({}, 'name');
    const existingNames = existingCategories.map(cat => cat.name.toLowerCase());

    // Filter out categories that already exist
    const newCategories = categoriesData.filter(
      cat => !existingNames.includes(cat.name.toLowerCase())
    );

    if (newCategories.length === 0) {
      console.log('✅ All categories already exist. No seeding needed.');
      return;
    }
    console.log(`🌱 Seeding ${newCategories.length} new categories...`);

    // Insert new categories
    const insertedCategories = await Category.insertMany(newCategories);
    
    console.log(`✅ Successfully seeded ${insertedCategories.length} categories:`);
    insertedCategories.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name}`);
    });

    // Display summary
    const totalCategories = await Category.countDocuments({ isActive: true });
    console.log(`📊 Total active categories in database: ${totalCategories}`);

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from database');
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedCategories, categoriesData };
