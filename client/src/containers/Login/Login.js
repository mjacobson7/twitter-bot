import React, { Component } from 'react';
import logo from '../../assets/goodBot.png';
import classes from './Login.module.css';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import axios from 'axios';
import { withRouter } from 'react-router-dom'

class Login extends Component {

    state = {
        email: null,
        password: null
    }

    emailChangeHandler(e) {
        this.setState({ email: e.target.value })
    }

    passwordChangeHandler(e) {
        this.setState({ password: e.target.value })
    }

    render() {
        return (
            // <div className={`${classes.container} col-xl-3 col-lg-4 col-md-6 col-sm-12`}>
            //     {/* <img src={logo} alt="logo" width="200" /> */}
            //     <a href="/auth/twitter" className={`${classes.button} btn-lg  mt-3`}>
            //         <span className="fab fa-twitter"></span> Sign in with Twitter
            //     </a>
            // </div>

            <div className={`${classes.container} col-xl-3 col-lg-4 col-md-6 col-sm-12`}>
                <img src={logo} alt="logo" width="200" />
                <Input
                    value={this.state.email}
                    onChange={(e) => this.emailChangeHandler(e)}
                    placeholder="Email"
                    type="text"
                    bootstrapClass="mt-3 mb-3">
                </Input>
                <Input
                    value={this.state.password}
                    onChange={(e) => this.passwordChangeHandler(e)}
                    placeholder="Password"
                    type="password"
                    bootstrapClass="mb-3">
                </Input>
                <Button bootstrapClass="btn-block" clicked={() => this.props.login(this.state)}>Login</Button>
                <p className="mt-5 mb-3 text-muted">© 2019</p>
            </div>
        )
    }
}

export default withRouter(Login);