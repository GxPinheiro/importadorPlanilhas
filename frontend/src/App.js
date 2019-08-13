import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './bootstrap.min.css';

import Home from './pages/Home';
import Charges from './pages/Charges';
import Units from './pages/Units';
import Condominiums from './pages/Condominiums';

class App extends Component {
    state = {
        files: [],
    };

    render() {
        return (
            <div className="form-control">
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/condominiums" exact component={Condominiums} />
                        <Route path="/charges" exact component={Charges} />
                        <Route path="/units" exact component={Units} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    };
}

export default App;
