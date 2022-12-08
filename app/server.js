const PORT= 3000
module.exports =
    require('./app').listen(PORT,
        ()=>console.log(`Listening on port ${PORT}`))