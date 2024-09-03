const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;
const mailer=require('./NODEMAILER/mailer.js');
// Middleware
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow requests from this origin
}));

// MongoDB connection
const password=process.env.PASSWORD;
const DB=`mongodb+srv://rs1220525:${password}@cluster0.pnrwmqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(DB,{
}).then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
// Define a schema for transactions
const transactionSchema = new mongoose.Schema({
    userId:String,
    itemName: String,
    price: Number,
    date: Date,
    numPeople: Number,
    peopleDetails: [{
        personName: String,
        personEmail: String,
        personPhone: String,
        amt: Number
    }]
});
const userDataSchema= new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    userId:String,
    password:String,
});

const userData=mongoose.model('userData',userDataSchema);
// Define a model for transactions
const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
    //Routes to add a new User
    app.post('/api/adduser',async(req,res)=>{
        const {name,email,phone,userId,password}=req.body;
        console.log(req.body);
        const newUser=new userData({
            name,
            email,
            phone,
            userId,
            password
        });
        try{
            const data=await newUser.save();
            console.log('New User Added To Database');
            res.status(201).json('ok');
        }catch(err){
            console.log('Error to adding new user');
            res.status(500).json('Internal Server Failure');
        }
    });
    let user;
    app.get('/api/users/:userId', async(req, res) => {
        const userId = req.params.userId;
        console.log('hi');
        console.log(userId);
         user = await userData.findOne({userId:userId });
        if (!user) {
            console.log('no');
          res.status(201).json('ok');
        } 
        else {
            console.log('yes');
            console.log(user);
            res.json(user);
        }
      });
// Route to add a new transaction
app.post('/api/addTransaction', async(req, res) => {
    const { itemName, price, date, numPeople, peopleDetails,userId } = req.body;
    console.log(req.body);
    const newTransaction = new Transaction({
        userId,
        itemName,
        price,
        date,
        numPeople,
        peopleDetails
    });

    try{
        const data= await newTransaction.save();
        console.log("New Transaction added ", data);
        res.status(201).json('ok');

        //email sending....
        const peopleEmails = peopleDetails.flatMap(person => person.personEmail);
        console.log('Extracted emails:', peopleEmails);
        const peopleAmount=  peopleDetails.flatMap(person => person.amt);

        const emailSubject = 'New Transaction Created';
        const emailText = `A new transaction has been created:
      - Item Name: ${itemName}
      - Price: ${price}
      - Date: ${date}
      - Number of People: ${numPeople}
      - User ID: ${userId}`;
    const emailHtml = `<p>A new transaction has been added on Hisab kitab:</p>
    <h2>Bill provider Details: </h2>
    <h3>Name:${user.name}</h3>
    <h3>email:${user.email}</h3>
    <h3>Contact No:${user.phone}</h3>
    <h3>User Id:${user.userId}</h3>
      <ul>
        <li>Item Name: ${itemName}</li>
         <li>Total Amount:${price}</h3>
        <li>Date: ${date}</li>
        <li>Number of People included: ${numPeople}</li>
      </ul>`;

    // Send email to each user
    for (const email of peopleEmails) {
      console.log('Sending email to:', email);
      await mailer.sendMail(email, emailSubject, emailText, emailHtml);
    }


        } catch (err) {
        console.error('Error adding new Transaction :', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch all transactions
app.get('/api/allTransactions/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
      // Find the transactions by user ID in the MongoDB collection
      const transactions = await Transaction.find({ userId: userId });
      console.log(transactions);
      if (transactions && transactions.length > 0) {
        res.json(transactions);
      } else {
        res.json(transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/',(req,res)=>{
    res.send('Hello From Server..');
});
app.delete('/api/delete/:id', async (req, res) => {
  console.log('hello');
  const id = req.params.id;
  console.log(id);
  try {
    const result = await Transaction.deleteOne({ _id: id });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
    res.status(200).json(`Document with ID ${id} deleted.`);
  } catch (err) {
      res.status(500).send('Error deleting document.');
  }
});
// Start the server
app.listen(PORT, () => {
    console.log('Server started at PORT:', PORT);
});
