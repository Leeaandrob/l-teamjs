import { useState, useEffect } from 'react';

import './App.css';

function AddTeam(setView) {
 let team;
 return (
     <div className="App">
       <header className="App-header">
       Adicionar um time
       </header>
       <div>
            <form>
              Nome do Time: <input type="text" placeholder={"Digite o nome do seu time"} initialvalues={""} value={team} onChange={(e) => { team = e.target.value }}/>
              <button type="button" onClick={() => {fetch('http://localhost:8080/clubs', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: team})
  });
              alert("Salvo com sucesso!")
              window.location.reload();
              }}>Salvar</button>
              <button type="button" onClick={() => {setView("home")}}>Cancelar</button>
            </form>
       </div>
     </div>
 )
}

function EditTeam(setView, team) {
 console.log(team)
 return (
     <div className="App">
       <header className="App-header">
       Editar um time
       </header>
       <div>
            <form>
              Nome do Time: <input type="text" placeholder={"Digite o nome do seu time"} defaultValue={team.name} onChange={(e) => { team.name = e.target.value }}/>
              <button type="button" onClick={() => {fetch('http://localhost:8080/clubs/' + team._id, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: team.name})
  });
              alert("Salvo com sucesso!")
              window.location.reload();
              }}>Salvar</button>
              <button type="button" onClick={() => {setView("listTeam")}}>Cancelar</button>
            </form>
       </div>
     </div>
 )
}

function Home(setView) {
  return (
    <div className="App">
      <header className="App-header">
      Home
      </header>
      <div>
          <button onClick={() => {
            setView("addTeam");
          }}>Adicionar time</button>
          <button onClick={() => {
            setView("listTeam");
          }}>Lista os times</button>
      </div>
    </div>
  );
}

function ListTeam(teams, setTeams, setView, setTeam) {
   return (
       <div className="App">
         <header className="App-header">
             Listar times
         </header>
         <div className="flex-container">
           <table className="row">
             <thead>
               <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
               </tr>
             </thead>
             <tbody>
                 {teams.map((club, idx) => {
                   return <tr key={idx} className="flex-item">
                       <th>{ club._id }</th>
                       <td>{ club.name }</td>
                       <td>
                         <button onClick={() => {
                             setView("editTeam")
                             setTeam(club)
                         } }>Editar</button>
                         <button onClick={() => {
                             fetch('http://localhost:8080/clubs/' + club._id, {
                                 method: 'DELETE',
                             })
                             alert("Excluído com sucesso!")
                             window.location.reload();
                         } }>Excluir</button>
                         </td>
                   </tr>
                 })}
             </tbody>
          </table>
         </div>
         <div>
           <button type="button" onClick={() => {setView("home")}}>Voltar para  Home</button>
         </div>
       </div>
   )
}

function renderView(view, setTeams, setView, teams, setTeam, team) {
  switch (view) {
    case 'home':
        return Home(setView);
    case 'addTeam':
        return AddTeam(setView);
    case "listTeam":
        return ListTeam(teams, setTeams, setView, setTeam);
    case "editTeam":
        return EditTeam(setView, team);
    default:
        return Home(setView);
  }
}

function App() {
  const [view, setView] = useState('home');
  const [teams, setTeams] = useState(null);
  const [team, setTeam] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8080/clubs");
      const data = await response.json();
      setTeams(data.data);
    }
    if (!teams) {
      fetchData();
    }
  }, [teams]);
  return renderView(view, setTeams, setView, teams, setTeam, team);
}

export default App;
