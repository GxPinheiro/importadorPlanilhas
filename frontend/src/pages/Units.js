import React, { Component } from 'react';
import api from '../services/api';
import Dropzone from 'react-dropzone';
const FileDownload = require('js-file-download');

export default class Units extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            hasError: false,
            errorMsg: '',
        }

        this.sendRequest = this.sendRequest.bind(this);
    }

    sendRequest = async (files) => {
        const data = new FormData();
        files.forEach((file) => {
            data.append('files', file);
        });

        try {
            await api.post(`/uploadUnits`, data).then((response) => {
                if (response.status >= 500) {
                    console.log(response);
                    this.setState({
                        hasError: true,
                        errorMsg: response.data,
                    });
                } else {
                    FileDownload(response.data, 'unidade.csv');
                }
            });
        }
        catch (err) {
            return;
        }
    }

    render() {
        const dropzoneStyle = {
            'marginLeft': '3%',
            'border' : "2px solid black",
            'display': 'inline-flex',
            'borderRadius': '5px',
            'width': '93%',
            'height': '200px',
            'padding': '4',
            'boxSizing': 'border-box'
        };

        const titleStyle = {
            'color': 'black',
        }

        const backButton = {
            'marginLeft': '4%',
            'marginTop': '10px',
        }

        return (
            <div>
                <div id="dropzone">
                    <h1 align="center" style={titleStyle}>Você deve enviar apenas a planilha (.csv)</h1>
                    <Dropzone onDrop={this.sendRequest} style={dropzoneStyle}>
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
                        <div className="alert alert-danger row">{this.state.errorMsg}</div>
                        : <div></div>
                    }
                </div>
            </div>
        );
    }
}
