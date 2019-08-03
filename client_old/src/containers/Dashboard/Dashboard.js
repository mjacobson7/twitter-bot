import React, { Component } from 'react';
import Header from '../Header/Header';
import BotList from '../../components/BotList/BotList';
import Button from '../../components/UI/Button/Button';
import axios from 'axios';
import classes from './Dashboard.module.css';


class Dashboard extends Component {

    state = {
        activeBots: null
    }

    componentDidMount() {
        axios.get('/botLists').then(retVal => {
            this.setState({ activeBots: retVal.data });
        })
    }

    createBotHandler() {
        this.props.history.push('/createBot')
    }

    botSelectedHandler(botId) {
        this.props.history.push(`/createBot/${botId}`);
    }

    render() {
        return (
            <div>
                <Header></Header>

                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <a href="/auth/twitter" className={`${classes.button} btn mt-3`}>
                                <span className="fab fa-twitter"></span> Add Twitter Bot
                            </a>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <BotList bots={this.state.activeBots} botSelected={(botId) => this.botSelectedHandler(botId)}></BotList>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;