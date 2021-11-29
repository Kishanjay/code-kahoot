import React from "react"

import Home from "./pages/Home"
import HostView from "./pages/HostView/index"
import GameView from "./pages/GameView/index"
import Login from "./pages/Login"

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/hostview/:gameRoomId">
            <HostView />
          </Route>
          <Route path="/gameview/:gameRoomId">
            <GameView />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
