import React, { Component } from 'react';
import api from '../services/api';
import Dropzone from 'react-dropzone';
const FileDownload = require('js-file-download');

export default class Charges extends Component {
    sendRequest = async (files) => {
        const data = new FormData();
        files.forEach((file) => {
            data.append('files', file);
        });

        try {
            await api.post(`/uploadCharges`, data).then((response) => {
                if (response.status >= 500) {
                    this.setState({
                        hasError: true,
                        errorMsg: response.data,
                    });
                } else {
                    FileDownload(response.data, 'cobranca.csv');
                }
            });
        }
        catch (err) {
            return;
        }
    }

    deleteFile = async () => {
        try {
            await api.post(`/charges?1`).then((response) => {
                console.log(response.data);
                if (response.status >= 300) {
                    this.setState({
                        hasError: true,
                        errorMsg: response.data,
                    });
                } else {
                    console.log(response);
                }
            });
        }
        catch (err) {
            return;
        }
    }

    constructor(props) {
        super(props);

        this.sendRequest = this.sendRequest.bind(this);
        this.deleteFile = this.deleteFile.bind(this);

        this.state = {
            files: [],
            hasError: false,
            errorMsg: '',
        }
    }

    render() {
        const dropzoneStyle = {
            'marginLeft': '3%',
            border : "2px solid black",
            display: 'inline-flex',
            borderRadius: '5px',
            width: '93%',
            height: '200px',
            padding: '4',
            boxSizing: 'border-box'
        };

        const titleStyle = {
            'marginLeft': '14%',
            'color': 'black',
        }

        const backButton = {
            'marginLeft': '4%',
            'marginTop': '1%',
            height: '40px',
        }

        const alertError = {
            width: '32%',
            'marginLeft': '3%',
            'marginTop': '1%',
            height: '40px',
        }

        return (
            <div>
                <div id="dropzone" className="row">
                    <h1 style={titleStyle}>Você deve enviar a planilha (.csv) junto de um arquivo 'de para' salvo em .txt</h1>
                    <Dropzone className="row" onDrop={this.sendRequest} style={dropzoneStyle}>
                        { ({ getRootProps, getInputProps }) => (
                            <div className="form-input" {...getRootProps()} style={dropzoneStyle}>
                                <input {...getInputProps()} />
                                <p>&nbsp;&nbsp;Arraste arquivos ou clique aqui</p>
                            </div>
                        )}
                    </Dropzone>
                </div>
                <div id="buttons" className="row">
                    <a href="/condominiums" className="btn btn-info col-md-2" style={backButton}>Voltar</a>
                    <a href="/charges" hidden onClick={this.deleteFile} className="btn btn-danger" style={backButton}>Deletar arquivo</a>
                    {(this.state.hasError) ?
                        <div className="alert alert-danger" style={alertError}>{this.state.errorMsg}</div>
                        : <div></div>
                    }
                    </div>
            </div>
        );
    }
}
