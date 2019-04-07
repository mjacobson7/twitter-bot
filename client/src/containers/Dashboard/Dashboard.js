import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import BotList from '../../components/BotList/BotList';
import Button from '../../components/UI/Button/Button';

class Dashboard extends Component {

    render() {
        return (
            <div>
                <Header></Header>

                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <Button bootstrapClass="mt-3 float-right">New Bot</Button>
                        </div>

                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <BotList></BotList>
                        </div>

                    </div>


                </div>





            </div>
        )
    }
}

export default Dashboard;