import axios from "axios";
import { useState } from "react";
import UserArchive from "../components/UserArchive";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Index() {
    const [isSearchingUser, setSearchingUser] = useState(false);
    const [userArchive, setUserArchive] = useState([]);
  
    async function searchUser() {
      setSearchingUser(true);
      if (isSearchingUser) return;
  
      const username = document.querySelector('#username').value;
      if (username) {
        const { data: { archives } } = await axios.get(`https://api.chess.com/pub/player/${username}/games/archives`)
        setUserArchive(archives);
        setSearchingUser(false);
      }
    }
  
    return (
      <div className="App">
        <div className="main-title">
          <h1>Chess.com Table</h1>
          <h3>made by Matheus Abido</h3>
        </div>
        <div className="user-config">
          <Input
            id="username"
            placeholder="your username"
            hint={<>The same in your profile URL. Example: <strong>matheusabidux</strong> (https://www.chess.com/member/<strong>matheusabidux</strong>)</>}
            >
              Username:
            </Input>
          <Button id="search-user" onClick={searchUser}>Search for user</Button>
          {isSearchingUser && (<h3 className="input-hint">Procurando usuário...</h3>)}
        
          {userArchive.length !== 0 && <UserArchive userArchive={userArchive} />}
        </div>
      </div>
    );
  }