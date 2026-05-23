import app from './app.js';
import connectDB from './src/config/db.js';
import { seedCategories } from './src/utils/seedCategories.js';

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedCategories();
  
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
