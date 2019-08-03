import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import { Route, withRouter } from 'react-router-dom';
import Login from './containers/Login/Login';
import Landing from './containers/Landing/Landing';
import Dashboard from './containers/Dashboard/Dashboard';
import CreateBot from './containers/CreateBot/CreateBot';
import Aux from './hoc/Aux/Aux';
import './App.css';
import axios from 'axios';
import { Redirect, Switch } from 'react-router-dom'

class App extends Component {

  state = {
    authenticated: false
  }

  componentDidMount() {
    this.userAuthenticated();
  }

  userAuthenticated() {
    axios.get('/userAuthenticated').then(retVal => {
      if (retVal.data) {
        this.setState({ authenticated: true })
        this.props.history.push('/dashboard')
      } else {
        this.setState({ authenticated: false })
      }
    })
  }

  loginHandler(login) {
    axios.post('/login', login).then(retVal => {
      if (retVal.data._id) {
        this.setState({ authenticated: true })
        this.props.history.push('/dashboard')
      } else {
        this.setState({ authenticated: false })
      }
    })

  }


  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" render={() => (<Landing />)} />
          <Route path="/login" render={() => (<Login login={(e) => this.loginHandler(e)} />)} />
          {this.state.authenticated ? <Route path="/dashboard" component={Dashboard} /> : null}
          {this.state.authenticated ? <Route exact path="/createBot" component={CreateBot} /> : null}
          {this.state.authenticated ? <Route path="/createBot/:botId" component={CreateBot} /> : null}
          <Route exact path="*" render={() => (<Redirect to="/login" />)} />
        </Switch>
      </Layout>
    );
  }
}

export default withRouter(App);
