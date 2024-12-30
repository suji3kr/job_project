<br><br>
## *Reduce*

<br><br>

* 최적화하기

* 
TestComp. jsx 에서 

### useReducer ---

따로 함수를 만들어두고
      
      function reducer(state, action) {
          switch (action.type) {
              case "INCREASE":
                  return state + action.data;
              case "DECREASE":
                  return state - action.data;
              case "INIT":
                  return 0;       /* 0으로 초기화*/
              default:
                  return state;
          }
      } 
<br>
위와 같이 호출함 .>!
<br><br>

      
       	<div>  {/* 아래의 함수를 외부로 호출 reduce */}
                      <button onClick={()=> dispatch({ type: "INCREASE", data:1})}>
                          +</button>
                      <button onClick={() => dispatch({ type: "DECREASE", data:1})}>
                          -</button>
                      <button onClick={() => dispatch({ type: "INIT", data:1})}>
                          0으로 초기화</button>
                  </div>


<br>

![화면 캡처 2024-12-24 110437](https://github.com/user-attachments/assets/1129e1c2-97ff-41d8-a24b-d3e3e0eb9737)


<br>
콘솔을 보고 리로드 되는 현상을 제거한다 - 최적화 

      import { useMemo, useState } from "react";
      import TodoItem from "./TodoItem";
      import "./TodoList.css";
      
      const TodoList = ({ todo, onUpdate, onDelete }) => {
          const [search, setSearch] = useState("");
          const onChangeSearch = (e) => {
              setSearch(e.target.value);
          };
      
          const getSearchResult = () => {
              return search === ""
              ?todo
              :todo.filter((it)=> 
                  it.content.includes(search.toLowerCase())
              );
          }; //대소문자를 구별하지 않고 검색
          const analyzeTodo =useMemo(() => {
              console.log("analyzeTodo 함수 호출");
              const totalCount = todo.length;
              const doneCount = todo.filter((it) => it.isDone).length;
              const undoneCount = totalCount - doneCount;
              return {
                  totalCount,
                  doneCount,
                  undoneCount,
              };
          },[todo]);
          const { totalCount, doneCount, undoneCount } = analyzeTodo;   //최적화 - 함수가 아님 값으로 바꿔줌(x)
          return (
          <div className="TodoList">
              <h4>TodoList 🌱</h4>
              <div>
                  <div>총 개수: {totalCount}</div>
                  <div>완료된 할 일: {doneCount}</div>
                  <div>아직 완료하지 못한 일: {undoneCount}</div>
      
              </div>
              <input
                  value={search}
                  onChange={onChangeSearch}
                  className="searchbar"
                  placeholder="검색어를 입력하세요" 
                  />
      
                  <div className="list_wrapper">
                  {getSearchResult().map((it) => (
                      <TodoItem key={it.id}{...it} 
                      onUpdate={onUpdate} 
                      onDelete={onDelete}
                      />
                  ))}
              </div>
          </div>
          );
      };
      
      export default TodoList;

<br>
<br>

![화면 캡처 2024-12-24 110556](https://github.com/user-attachments/assets/33bfec9b-e63d-43dd-879c-4710d0021b4d)

<br>
<br>

![화면 캡처 2024-12-24 113011](https://github.com/user-attachments/assets/b56e1638-e39b-4ec5-9fb5-c8f5e03680b4)

<br>
<br>

### * 횡단관심사
![화면 캡처 2024-12-24 113608](https://github.com/user-attachments/assets/4fdfb421-6238-4968-879f-e4f1b4ef91cd)

<br>
<br>


AOP > 관점지향
>.로깅 .트랜젝션 .시큐리티
<br>
--------------------- 불필요한 컴포넌트 리랜더 방지하기

<br>
<br>

#### HOC
<br>
Higher Order Component 고차 컴포넌트

<br>
<br>

Header.jsx 
<br>

      import React from "react";
      import "./Header.css";
      const Header =() => {
          console.log("Header 업데이트"); //Header 컴포넌트 호출, 리랜더될때마다 콘솔에 출력
          return (
              <div className="Header">
                  <h3>오늘은 📅</h3>
                  <h1>{new Date().toDateString()}</h1>
              </div>
          );
      };
      
      export default React.memo(Header);

<br><br>

리스트 체크 할 때도 Header업데이트  가 계속 호출되는 현상 제거 

      export default React.memo(Header);
<br>
- 1회성 유지 

---------------------------------------
<br>
렌더링 시간 최소화 

** 웹브라우저는 서버로 부터 도착하는 시간 확인
  컴포넌트 별로 ( 최적화 후 Time - ms 체크 )

<br>

![화면 캡처 2024-12-24 114440](https://github.com/user-attachments/assets/e2ffd98a-c364-4659-a0f6-251816e0658f)

<br>

![화면 캡처 2024-12-24 114513](https://github.com/user-attachments/assets/349480f3-5c83-4035-99db-ee7f353b268a)


한 가지를 추가하는데 (1.함수 호출) + 업데이트 TodoItem 이 4번 (3,0,1,2) 전부 됨... 
- > 해당 리랜더 현상 방지하기 위해선...????
<br>

#### export default React.memo(TodoItem);
* 해당 default 를 줘도 콘솔이 그대로 리랜더됨

<br>
<br>

1. 분할 : useState -> **useReduce**

2. 최적화(시간단축) : **useMemo**

3. useContext
   
컴퓨터에 Props로 데이터 전달
- Props를 사용하지 않는 방법

<br>
<br>

--------------------------------
**Props Drilling 문제를 해결하기 위해서 필요함.!**

Context로 리팩터링 하기 
<br>

![화면 캡처 2024-12-24 120259](https://github.com/user-attachments/assets/04161fa4-fe00-40fb-b6a0-89bd8b6676c8)

<br>

전역 변수와 비슷한 경우인데 굳이 타고 내려가지 않아서 편하긴 하지만,
정확한 지정이 되지 않아서 누구나 타고 들어올 수 있는 것이 단점이다.
( 원하는 포인트를 콕 집어서 호출하는 방법은 다른 호출) 

Context는 전역 호출 - 공유 가능해서 드릴링 방식을 쓰고 싶지 않을 때 편리한 기능



------------------------------------------------------------
<br>
<br>

## * Application Program Interface -> SDK 
<br>

### * API (Application Programming Interface)
API는 응용 프로그램 인터페이스로, 소프트웨어 애플리케이션 간의 상호작용을 가능하게 하는 규격

<br>

### * SDK (Software Development Kit)
SDK는 소프트웨어 개발 키트로, 개발자가 특정 플랫폼이나 기술을 사용하여 소프트웨어를 개발할 수 있도록 돕는 도구 모음입니다.


<br>
<br>


![화면 캡처 2024-12-24 120630](https://github.com/user-attachments/assets/05b621c5-2205-4a8a-a8ec-1dff375817c6)

<br>

#### const TodoContext = React.createContext();


function App()

      
        return(
          <div className="App">
            <Header />
            <TodoContext.Provider>
              <TodoEditor onCreate={onCreate} />
              <TodoList todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
            </TodoContext.Provider>
          </div>
        );
      }

<br>

#### + value 추가
       <TodoContext.Provider value={{todo, onCreate, onUpdate, onDelete }}>

<br>

#### - props관련 ={} 삭제

  
      <TodoEditor />
              <TodoList />
      </TodoContext.Provider>

<br>
<br>

![화면 캡처 2024-12-24 122857](https://github.com/user-attachments/assets/670daf8f-378b-49b3-bbcb-7ecc8ea1c732)

**일시적으로 받는 props 없어서 'length' 가 뜸 (읽히는 내용이 없음)
오류 내용을 보고 어디부터 수정해 나갈지 확인하는 방법이다.

<br>

#### const TodoList = ({ todo=[], onUpdate, onDelete }) => {
todo =[] 초기값 변경

<br>


![화면 캡처 2024-12-24 123428](https://github.com/user-attachments/assets/f19dbde8-52a7-4ece-a58f-fcfd9ff918dc)

<br>

<br>

#### +  수출 내보내기 (export 추가) App
      export const TodoContext = React.createContext();



TodoList.jsx

      const TodoList = ({ todo=[], onUpdate, onDelete }) => {
          const storeData = useContext(TodoContext);
          console.log(storeData);


<br>

---------------------------------------------------------------------

<br>


데이터 정상적으로 들어오는 지 확인 후 console 삭제 

      const TodoList = ({ todo=[], onUpdate, onDelete }) => {
          const {todo, onUpdate, onDelete} = useContext(TodoContext)
          // const storeData = useContext(TodoContext);
          // console.log(storeData);
          
<br>


- props제거 
      const TodoList = () => {
          const {todo, onUpdate, onDelete} = useContext(TodoContext)
                


