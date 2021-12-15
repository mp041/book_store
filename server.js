require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser')

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
  useTempFiles : true,
}));

app.use('/user',require('./routes/userRoute'));
app.use('/api',require('./routes/categoryRouter'));
app.use('/api',require('./routes/upload'));
app.use('/api',require('./routes/productRouter'));





const URI = process.env.MONGODB_URL

mongoose.connect(URI,{
  useNewUrlParser : true,
  useUnifiedTopology : true,
}, err => {
  if(err) throw err;
   console.log('Connected to Mongodb');
});

// app.get('/', (req,res) => {
//   res.json({msg : "HELLLO WORLD"})
// })

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
  console.log( `Connected to ${PORT}`)
});
