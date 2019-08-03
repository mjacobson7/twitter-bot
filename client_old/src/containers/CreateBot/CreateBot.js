import React, { Component } from 'react';
import Header from '../Header/Header';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import axios from 'axios';

class CreateBot extends Component {

    state = {
        id: null,
        twitterHandle: '',
        searchTerm: '',
        searchCount: 0,
        active: false
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        if (params.botId) {
            axios.get(`/bot/${params.botId}`).then(retVal => {
                this.setState({
                    id: retVal.data._id,
                    twitterHandle: retVal.data.twitterHandle,
                    searchTerm: retVal.data.searchTerm,
                    searchCount: retVal.data.searchCount,
                    active: retVal.data.active
                })
            })
        }
    }

    nameChangeHandler(e) {
        this.setState({ name: e.target.value })
    }

    searchTermChangeHandler(e) {
        this.setState({ searchTerm: e.target.value })
    }

    searchCountChangeHandler(e) {
        this.setState({ searchCount: e.target.value })
    }

    activeChangeHandler() {
        this.setState(prevState => ({ active: !prevState.active }))
    }

    cancelHandler() {
        this.props.history.push('/dashboard');
    }

    saveHandler() {
        axios.post('/saveBot', this.state).then(retVal => {
            this.props.history.push('/dashboard');
        })
    }

    render() {
        return (
            <div>
                <Header></Header>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <div className="my-3 p-3 bg-white rounded box-shadow">
                                <h6>Handle</h6>
                                <Input
                                    label="Bot Name"
                                    bootstrapClass="mb-2"
                                    onChange={(e) => this.nameChangeHandler(e)}
                                    value={`@${this.state.twitterHandle}`}>
                                </Input>
                                <Input
                                    label="Search Term"
                                    bootstrapClass="mb-2"
                                    onChange={(e) => this.searchTermChangeHandler(e)}
                                    value={this.state.searchTerm}>
                                </Input>
                                <Input
                                    label="Search Count"
                                    type="number"
                                    bootstrapClass="mb-2"
                                    onChange={(e) => this.searchCountChangeHandler(e)}
                                    value={this.state.searchCount}>
                                </Input>
                                <Input
                                    label="Active"
                                    type="checkbox"
                                    bootstrapClass="mb-2"
                                    onChange={(e) => this.activeChangeHandler(e)}
                                    value={this.state.active}>
                                </Input>
                                <Button clicked={() => this.saveHandler()} bootstrapClass="mr-2 mt-2">Save</Button>
                                <Button clicked={() => this.cancelHandler()} bootstrapClass="mt-2">Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateBot;