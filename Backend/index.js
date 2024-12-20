const express = require('express');
const {todos} = require('./db.js') 
const  {authentication} = require('./zod.js');
const {authentication_id} = require('./zod.js')
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json()); 
app.use(cors());


app.get('/', async (req, res) => {
    try {
           const data = await todos.find();
           if(!data)
           {
            res.json({
                msg:'todos is not there !'
            })}

            return res.json({ todos: data })
        }
     catch (err) {
        console.error('Error fetching todos:', err);
    }
});
  
     app.post('/todos', async (req,res)=>
    {

        try{
            const create_payload = req.body;
            const data = authentication.safeParse(create_payload)
            if(!data.success)
           {
           res.status(411).json({
            msg:'wrong input',
           })
           return
        }

        
        const new_todos = await todos.create({
            title : create_payload.title,
            description:create_payload.description,
           })
           res.status(200).json({
              msg:'Todos added',
              todos : new_todos
            });
        }catch(err)
        {
          console.log('something went wrong'+ err)
        }
    })

    app.put('/update/:id', async(req,res)=>
{
    try{
        const todos_id = (req.params.id);
        const auth = authentication_id.safeParse({_id:todos_id});
        if(!auth.success)
        {
           res.status(400).json({
           msg:'Invalid'
           })
        }

        const kuch_bhi = req.body;
        const safe_parsed = authentication.safeParse(kuch_bhi);
        if(!safe_parsed.success)
        {
          res.status(400).json({
            msg:'Invalid Input'
          })
        }



        const update_todos = await todos.findByIdAndUpdate(todos_id,kuch_bhi,{new:true})
           if(update_todos) 
           {
              res.status(200).json({
                msg:'updated sucessfully',
                todos :update_todos
              })
           }
       
    }catch(err)
    {
       console.log('something went wrong'+ err)
    }
    
})
  
      app.delete('/delete/:id', async (req, res) => {
        try {
        const { id } = req.params;
        const idValidation = authentication_id.safeParse({ _id: id });
        if (!idValidation.success) {
            return res.status(400).json({
                msg: 'Invalid ID',
                errors: idValidation.error.errors,
            });
        }

        const deletedTodo = await todos.findByIdAndDelete(id);
        if (deletedTodo) {
            return res.status(200).json({
                status: 'Successfully deleted!',
                todo: deletedTodo,
            });
        } else {
            return res.status(404).send('Todo not found.');
        }
    } catch (err) {
        console.error('Error deleting todo:', err);
        return res.status(500).send('Failed to delete todo: ' + err.message);
    }
});



const listen = 3000;
app.listen(listen, () => {
    console.log(`Listening on port: ${listen}`);
});

