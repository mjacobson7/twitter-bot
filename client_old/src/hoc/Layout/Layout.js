import React, { Component } from 'react';
import classes from './Layout.module.css';

class Layout extends Component {
    render() {
        return (
            <div className="row">
                <div className={`${classes.container} container-fluid`}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Layout;