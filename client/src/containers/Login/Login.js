import React, { Component } from 'react';
import logo from '../../assets/goodBot.png';
import classes from './Login.module.css';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';

class Login extends Component {

    render() {
        return (
            <div className={`${classes.container} col-xl-3 col-lg-4 col-md-6 col-sm-12`}>
                <img src={logo} alt="logo" width="200" />
                <Input type="email" placeholder="Email" bootstrapClass="form-control mb-2 mt-4"></Input>
                <Input type="password" placeholder="Password" bootstrapClass="form-control"></Input>
                <Button bootstrapClass="btn-lg btn-block mt-3">Login</Button>
            </div>
        )
    }
}

export default Login;