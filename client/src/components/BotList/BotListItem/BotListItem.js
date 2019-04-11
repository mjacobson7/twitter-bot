import React from 'react';
import classes from './BotListItem.module.css';

const botListItem = props => {
    if (props.bots) {
        let bots = props.bots.map(bot => (
            <div onClick={() => props.clicked(bot._id)} key={bot._id} className={`${classes.bot} media text-muted pt-3`}>
                <span className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    <h5 className="d-block text-gray-dark">{bot.name}</h5>
                    <span className="mr-2">
                        <strong className="text-gray-dark">Handle: </strong>
                        <span>@{bot.twitterHandle}</span>
                    </span>
                    <span className="mr-2">
                        <strong className="text-gray-dark">Status: </strong>
                        <span style={{ color: `${bot.active ? 'green' : 'red'}` }}>{bot.active ? 'Active' : 'Inactive'}</span>
                    </span>
                    <span className="mr-2">
                        <strong className="text-gray-dark">Search Term: </strong>
                        <span>{bot.searchTerm}</span>
                    </span>
                    <span className="mr-2">
                        <strong className="text-gray-dark">Search Count: </strong>
                        <span>{bot.searchCount}</span>
                    </span>
                </span>
            </div>
        ))
        return bots;
    } else {
        return null;
    }


}

export default botListItem;