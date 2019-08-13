const csv = require('csv-parser');
const fs = require('fs');

module.exports = {
    async sendUnits(req, res) {
        if (!req.files) {
            return res.json("Nenhum arquivo enviado");
        }

        if (file.originalname.includes(".xls") || file.originalname.includes(".xlsx")) {
            return res.json("Formato de arquivo inválido");
        }

        if (req.files.length != 1) {
            return res.json("Você não pode enviar mais de um arquivo");
        }

        await readFile(req.files[0].path, importType = null);

        await req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });

        var options = {
            root: './src/files/output/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true,
                'Content-Type': 'file/csv',
                'Content-Disposition': 'attachment; filename="exemploUnidade.csv"'
            }
        }

        setTimeout(function(){
            res.sendFile('exemploUnidade.csv', options);
        }, 2000);

    },
};

function readFile(filePath) {
    let results = [];

    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        processarCsv(results);
    });
}

function processarCsv (results) {
    var csvOutput = [];

    results.forEach(function (line, key) {
        var lineOutput = {
            bloco: line['apart_bloco'],
            unidade: line['apart_apto'],
            fração: line['apart_fracao'],

            proprietario_nome: line['propriet_nome'],
            proprietario_endereço: line['propriet_endereco'],
            proprietario_bairro: line['propriet_bairro'],
            proprietario_cep: getCep(line['propriet_cep']),
            proprietario_cidade: line['propriet_cidade'],
            proprietario_telefone: joinTwoDatas(line['propriet_fonec'], line['propriet_foner']),
            proprietario_estado: line['propriet_celular'],
            proprietario_email: joinTwoDatas(line['propriet_mail'], line['propriet_mail2']),
            proprietario_rg: getRg(line['propriet_rg']),
            proprietario_cpf: line['propriet_doc/cnpj'],

            inquilino_nome: line['morador_nome'],
            inquilino_telefone: joinTwoDatas(line['morador_fonec'], line['morador_foner']),
            inquilino_celular: line['morador_celular'],
            'inquilino_cpf/cnpj': line['morador_doc'],
            inquilino_rg: getRg(line['morador_rg']),
            inquilino_email: joinTwoDatas(line['morador_mail'], line['morador_mail2']),
        };

        csvOutput.push(lineOutput);
    });

    fs.writeFile('./src/files/output/exemploUnidade.csv', convertToCsv(csvOutput),{enconding:'latin1',flag: 'w+'}, function (err) {
        if (err) throw err;
        console.log('Arquivo salvo!');
    });
}

function convertToCsv(data) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r\n');

    return csv;
}

function getCep(cep) {
    if (!cep) {
        return '';
    }

    cep = String(cep);
    return cep;
}

function getRg(rg) {
    if (!rg) {
        return "";
    }

    return rg = rg.replace("RG:", "").replace(" ", "");
}

function joinTwoDatas(field1, field2) {
    if (!field1 && !field2) {
        return ''
    } else if (!field1 || !field2) {
        return String(field1) + String(field2);
    } else {
        return String(field1) + ';' + String(field2);
    }
}
