const mongoose = require('mongoose')
//mongodbServer=mongodb://127.0.0.1:27019/avatar2
// mongodbServer=mongodb+srv://taskapp:cosmicgenesis@cluster0.xq7uo.mongodb.net/orel?retryWrites=true
mongoose.connect(process.env.mongodbServer, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
