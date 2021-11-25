import React from "react"

import Home from "./pages/Home"
import Host from "./pages/Host"
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
          <Route path="/host">
            <Host />
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
