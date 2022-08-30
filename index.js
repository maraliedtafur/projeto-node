const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks', async (req, res) => {
  const task = await tasks.findAll();

  try {
    res.status(200).json(task);
  } catch (error) {
    res.status(400).send(error);
  }
})

// Create task
app.post('/tasks', async (req, res) => {
  const body = req.body
  try {
    tasks.create(body);
    res.status(200).json({ action: 'Task created' })
  } catch (error) {
    res.status(400).send(error);
  }
})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await tasks.findByPk(taskId);

  try {
    if (!task) {
      res.status(400).json({ action: "Task not found" });
    } else {
      res.status(200).json(task);
    }
  } catch (error) {
    res.status(400).send(error);
  }
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const body= req.body;
  const task = await tasks.findByPk(taskId);

  try {

    if (!task) {
      res.status(400).json({ action: "Task updated" });
    } else {
      task.update({
        id: task.id,
        description: body.description,
        done: body.done,
        createAt: task.createAt,
        updateAt: task.updateAt
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const task = await tasks.destroy({ where: { id: taskId } });

  try {
    if (!task) {
      res.status(400).json({ action: 'Task not found' });
    }
    task.status(400).json({ action: 'Task removed' });
  } catch (error) {
    res.status(400).send(error);
  }
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})

