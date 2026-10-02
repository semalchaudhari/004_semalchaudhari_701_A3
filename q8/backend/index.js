import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', studentRoutes);

// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => console.error('Failed to sync db: ', err));