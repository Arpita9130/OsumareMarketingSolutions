const express = require('express');
const tasks=require("./MOCK_DATA.json")
const app = express();
const fs=require('fs')
const port = process.env.PORT || 3000;
app.use(express.urlencoded({extended: false}));


    app.get('/tasks',(req,res)=>{
        const html=`
        <ul>
        ${tasks.map((tsk)=>`<li>${tsk.task}</li>`).join("")}
        </ul>`;
        res.send(html);

    });

  app.get('/api/tasks', (req, res) => {
    return res.json(tasks);
  });

  app.get('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
      }
    return res.json(task);
    
   
  });

  app.post('/api/tasks', (req, res) => {
    
   const body=req.body;
   tasks.push({...body,id: tasks.length+1});
   fs.writeFile('./MOCK_DATA.json',JSON.stringify(tasks),(err,data)=>{
    return res.json({status:"Success",id:tasks.length});
   });
   
  });

  app.put('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
  const updatedTask = {
    id:id,
    task:req.body.task,
    description:req.body.description
  };

  // Find the task index
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).send({ error: 'Task not found' });
  }
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask }; 
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(tasks), (err) => { 
        if (err) {
          return res.status(500).send({ error: 'Error writing to file' });
        }
        return res.json({ status: "Success", id: tasks.length });
      });
  
  });


  app.delete('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).send({ error: 'Task not found' });
  }

    tasks.splice(taskIndex, 1);

   
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(tasks), (err) => {
        if (err) {
          console.error(err); 
          return res.status(500).send({ error: 'Error deleting task' }); 
        }
    
        return res.json({ message: 'Task deleted successfully',size:tasks.length });
      });
  });

app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`);
});
            