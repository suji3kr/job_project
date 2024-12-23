import { useRef, useState } from 'react';
import './App.css'
import Header from './component/Header';
import TodoEditor from './component/TodoEditor';
import TodoList from './component/TodoList';


const mockTodo =[
  {
    id:0,
    isDone: false,
    content: "React 공부하기",
    createDate : new Date(). getTime(),

  },
  {
    id:1,
    isDone: false,
    content: "빨래 널기",
    createDate : new Date(). getTime(),

  },
  {
    id:2,
    isDone: false,
    content: "노래연습 하기",
    createDate : new Date(). getTime(),

  },
];

function App() {
  const idRef = useRef(3);
  const [todo, setTodo] = useState(mockTodo);

  const onCreate = (content) => {
    const newItem = {
      id: idRef.current,
      content,
      isDone: false,
      createDate : new Date().getTime(),
    };
    setTodo([...todo, newItem]);
    idRef.current += 1;
  };

  const onUpdate = (targetId) => {
    setTodo(
      todo.map((it) =>
        it.id === targetId ? {...it, isDone: !it.isDone} : it
      )
    );
  };  

  const onDelete = (targetId) => {
    setTodo(todo.filter((it) => it.id!== targetId));
  };

  return(
    <div className="App">
      <Header />
      <TodoEditor onCreate={onCreate} />
      <TodoList todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
}

export default App;
