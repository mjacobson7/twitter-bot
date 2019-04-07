import React from 'react';
import smallLogo from '../../assets/goodBotSmall.png';

const header = props => (
    // <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark"></nav>


    <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="/dashboard">
            <img src={smallLogo} width="30"  className="d-inline-block align-top mr-2" alt="" />
            goodBot
        </a>
    </nav>
        )

export default header;