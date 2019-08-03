import React, { Component } from 'react';
import smallLogo from '../../assets/goodBotSmall.png';
import axios from 'axios';
import { withRouter } from 'react-router-dom'

class Header extends Component {

    signOut = () => {
        axios.get('/signout').then(() => {
            this.props.history.push('/login');
        })
    }

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark" >
                <a className="navbar-brand" href="/dashboard">
                    <img src={smallLogo} width="30" className="d-inline-block align-top mr-2" alt="" />
                    goodBot
                </a>
                <ul style={{ cursor: 'pointer' }} className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <a onClick={this.signOut} className="nav-link">Sign Out</a>
                    </li>
                </ul>
            </nav>
        )
    }


}

export default withRouter(Header);