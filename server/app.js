require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const mongoose = require('mongoose')
const path = require('path')

// Mongoose connection

let isConnected = false // to track connections

const connectToDB = async () => {
	mongoose.set('strictQuery', true)

	if (isConnected) {
		console.log('MongoDB is already connected')
		return
	}

	try {
		// await mongoose.connect(process.env.MONGODB_URI, {
		await mongoose.connect(process.env.MONGODB_URI, {
			dbName: 'portfolioDB',
		})

		isConnected = true

		console.log('MongoDB Connected')
	} catch (err) {
		console.log(err)
	}
}
connectToDB()

//Mongoose Schema
const messageSchema = new mongoose.Schema(
	{
		name: String,
		subject: String,
		email: String,
		message: String,
	},
	{ timestamps: true },
)

const Message = mongoose.model('Message', messageSchema)

const app = express()

app.use(express.static(path.join(__dirname, '../client/public')))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'))
	// res.sendFile(__dirname + '/index.html')
})

app.post('/send', async (req, res) => {
	// const { name, subject, email, message } = req.body
	await connectToDB()

	const newMessage = new Message({
		name: req.body.name,
		subject: req.body.subject,
		email: req.body.email,
		message: req.body.message,
	})

	await newMessage
		.save()
		.then(() => {
			res.redirect('/')
		})
		.catch(err => console.log(err))
})

app.listen(process.env.POST || 3000, () => {
	console.log('Server started on port 3000')
})
