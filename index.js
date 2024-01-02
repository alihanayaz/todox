import express from 'express';
import bodyParser from 'body-parser';
import pug from 'pug';
import { v4 as uuid } from 'uuid';

const app = express();
let todos = [];

const getItemsLeft = () => {
  return todos.filter((todo) => !todo.isCompleted).length;
};

app.set('views', 'views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));

app.get('/', (req, res) => {
  res.render('index', { todos, itemsLeft: getItemsLeft() });
});

app.post('/todos', (req, res) => {
  const newTodo = {
    id: uuid(),
    name: req.body.name,
    isCompleted: false,
  };
  todos.unshift(newTodo);

  const todoItemTemplate = pug.compileFile('views/todo-item.pug');
  const todoItemMarkup = todoItemTemplate({ todo: newTodo });
  const itemCountTemplate = pug.compileFile('views/item-count.pug');
  const itemCountMarkup = itemCountTemplate({ itemsLeft: getItemsLeft() });
  res.send(todoItemMarkup + itemCountMarkup);
});

app.delete('/todos/:id', (req, res) => {
  todos = todos.filter((todo) => todo.id !== req.params.id);
  const itemCountTemplate = pug.compileFile('views/item-count.pug');
  const itemCountMarkup = itemCountTemplate({ itemsLeft: getItemsLeft() });
  res.send(itemCountMarkup);
});

app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((todo) => todo.id === req.params.id);
  if (!todo) return res.sendStatus(404);
  todo.isCompleted = !todo.isCompleted;
  const todoItemTemplate = pug.compileFile('views/todo-item.pug');
  const todoItemMarkup = todoItemTemplate({ todo });
  const itemCountTemplate = pug.compileFile('views/item-count.pug');
  const itemCountMarkup = itemCountTemplate({ itemsLeft: getItemsLeft() });
  res.send(todoItemMarkup + itemCountMarkup);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
