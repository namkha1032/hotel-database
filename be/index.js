const app= require('./app') // the actual Express application

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})