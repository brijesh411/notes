const express = require('express')
const app = express()
const cors = require('cors')


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(cors())

app.use(express.json())

app.use(requestLogger)
app.use(express.static('build'))

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  // const app = http.createServer((request,response) => {
  //   response.writeHead(200, {'Content-Type':'application/json' })
  //   response.end(JSON.stringify(notes))
  // })
 

  app.get('/' , (request , response) => {
    response.send('<h1>Hello World!</h1>')
    
     })

  app.get('/api/notes' , (request , response) => {
    response.json(notes)
  })



  app.get('/api/notes/:id' , (request , response) => {
    // below code will return id in string format and so when we compare id in note function error occurs as originally id is in number.
    // const id = request.params.id
    

      const id = Number(request.params.id)

      const note = notes.find((note) => {
        // console.log(note.id , typeof note.id, id , typeof id , note.id === id);  
        return note.id === id
      })  
      // console.log(note);   
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
       })

  app.delete('/api/notes/:id' , (request,response) => {
        const id = Number(request.params.id)
        notes = notes.filter(note => note.id !==id)

        response.status(204).end()
       })

// this put thing was not in fullstackopen website.
// chatgpt gave this code and when asked why changes made from frontend file does not change the backend file notes array , it replied that this changes would be stored in memory and not be reflected to code. it reflect until server is running so as we close nodemon server all changes made in notes file would be erased. to make changes permanent we need to store it in a database.
// below is the message wrote by chatgpt
// The code you shared is the frontend code, which is responsible for making HTTP requests to the backend API. When you call the update function with an id and a newObject, it sends a PUT request to the backend API at the specified baseUrl with the id and newObject in the request body.

// The backend API receives the request, processes it, and updates the notes array accordingly. However, the changes made to the notes array in the backend are not reflected in the backend code file itself. The notes array is stored in memory, not in a file, and its state is maintained as long as the backend server is running.

// If you stop and restart the backend server, the notes array will be reset to its initial state. If you want to persist the state of the notes array, you need to store it in a file or a database.

// here frontend code shared is refered to services/notes.js file 

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (!note) {
    return response.status(404).json({ 
      error: 'note not found',
    
    })
  
}

  const body = request.body
  const updatedNote = { ...note, ...body }

  notes = notes.map(note => note.id === id ? updatedNote : note)

  response.json(updatedNote)
})

  const generatedId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
  }

  app.post('/api/notes' , (request , response) => {
   
    const body = request.body
    
    if(!body.content) {
      // this will be printed in console of our backend not in browser console to display error in console changes needed in app.js file maybe some if condition to check if empty string is passed.
      console.log("You are passing an empty message");
      return( 
        response.status(400).json({
        error : 'content missing'
      }) 
      )
    }
    
    const note = {
      content : body.content ,
      important : body.important || false ,
      date: new Date(),
      id : generatedId()
    }
    notes = notes.concat(note)

    response.json(note)
  })


  app.use(unknownEndpoint)
  // app.listen(3002, () => console.log('Server is now running on port 3002'));

  const PORT = process.env.PORT || 3004
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })


// const express = require('express')
// const app = express()
// const cors = require('cors')

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(cors())
// app.use(express.json())
// app.use(requestLogger)
// app.use(express.static('build'))

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]


// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

// app.get('/api/notes', (req, res) => {
//   res.json(notes)
// })

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const note = {
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })

// app.get('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)

//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }

//   response.json(note)
// })

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)

//   response.status(204).end()
// })

// app.use(unknownEndpoint)

// const PORT = process.env.PORT || 3008
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })