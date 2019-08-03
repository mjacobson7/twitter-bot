import React from 'react';
import classes from './Button.module.css';

const button = props => {

    return (
        <button
            type="button"
            disabled={props.disabled}
            className={`${classes.button} ${props.bootstrapClass} btn `}
            onClick={props.clicked}>
            {props.children}
        </button>
    )

}

export default button;