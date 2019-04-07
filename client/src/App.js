import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import { Route } from 'react-router-dom';
import Login from './containers/Login/Login';
import Dashboard from './containers/Dashboard/Dashboard';
import './App.css';

class App extends Component {
  render() {
    return (
      <Layout>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </Layout>
    );
  }
}

export default App;
