import React from 'react';
import BotListItem from './BotListItem/BotListItem';

const botList = props => (
    <div className="my-3 p-3 bg-white rounded box-shadow">
        <h6 className="border-bottom border-gray pb-2 mb-0">Current Bots</h6>
        <BotListItem bots={props.bots} clicked={props.botSelected}></BotListItem>
    </div>
)

export default botList;