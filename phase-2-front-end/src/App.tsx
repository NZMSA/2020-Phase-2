import React from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import HistoricalGrid from "./components/HistoricalGrid/HistoricalGrid";
import LatestGrid from "./components/LatestGrid/LatestGrid";

import "./App.css";

const App = () => {
  return <BrowserRouter>
  <Switch>
    <Route path='/history' component={HistoricalGrid} />
    <Route path='/' component={LatestGrid} />
  </Switch>
  </BrowserRouter>
};

export default App;
