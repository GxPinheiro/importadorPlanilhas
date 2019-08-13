import React, { Component } from 'react';

export default class Home extends Component {
    render() {

        const titleStyle = {
            'marginLeft': '27%',
            'color': 'black',
        }
        
        const rowStyle = {
            'marginTop': '5%',
        }

        return (
            <div>
                <h1 style={titleStyle}>Selecione o sistema</h1>
                <div style={rowStyle} className="row">
                    <div className="col-md-1"></div>
                    <a href="/condominiums" className="btn btn-info col-md-3">Condomínios</a>
                    <div className="col-md-1"></div>
                    <a href="/" className="btn btn-info col-md-3">Assinaturas</a>
                </div>
                <div style={rowStyle} className="row">
                    <div className="col-md-1"></div>
                    <a href="/" className="btn btn-info col-md-3">Educacional</a>
                    <div className="col-md-1"></div>
                    <a href="/" className="btn btn-info col-md-3">Imobiliárias</a>
                </div>
            </div>
        );
    }
}
