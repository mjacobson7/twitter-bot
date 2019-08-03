import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import classes from './Input.module.css';

const input = props => {
    let label = null;

    if (props.label) {
        label = (
            <label className={classes.label}>{props.label}</label>
        )
    }

    return (
        <Aux className="form-group">
            {label}
            <input
                value={props.value}
                checked={props.value}
                onChange={props.onChange}
                type={props.type}
                className={`form-control ${props.bootstrapClass}`}
                placeholder={props.placeholder} />
        </Aux>



    )

}

export default input;