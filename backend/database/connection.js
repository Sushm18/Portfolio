import mongoose from "mongoose";

export const dbConnection  = () => {
  const dbURL = 'mongodb://localhost:27017/portfolio'|| process.env.DB_URL ;

  mongoose.connect(dbURL)
  .then((data) => {
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  })
  .catch((err) => {
    console.error('Error while connecting with MongoDB:', err.message);
  });
};
