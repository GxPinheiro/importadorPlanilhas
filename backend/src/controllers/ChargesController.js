const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment');

module.exports = {
    async sendCharges(req, res) {
        if (!req.files) {
            return res.status(500).json("Nenhum arquivo enviado");
        }

        if (req.files.length != 2) {
            return res.status(500).send("É necessário enviar dois arquivos, a planilha CSV e o depara.txt");
        }

        let categoryTxt = await readTxtFile(req.files);

        var csvFile = await req.files.filter(file => {
            if (file.originalname.includes(".csv")) {
                return file;
            }

            if (file.originalname.includes(".xls") || file.originalname.includes(".xlsx")) {
                return res.json("Formato de arquivo inválido");
            }
        });

        var options = {
            root: './src/files/output/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true,
                'Content-Type': 'file/csv',
                'Content-Disposition': 'attachment; filename="exemploCobranca.csv"'
            }
        }

        await readFile(csvFile[0].path, categoryTxt);

        await req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });

        setTimeout(function(){
            res.sendFile('exemploCobranca.csv', options);
        }, 2000);
    },

    async clearFiles(req, res) {
        console.log("Entrou aqui");
        console.log(req.body);
    }
};

async function readTxtFile(files) {
    try {
        file = await files.filter(file => {
            if (file.originalname.includes(".txt")) {
                return file;
            }
        });

        let categoryTxt = await fs.readFileSync(file[0].path, "utf-8");

        return categoryTxt;
    } catch(err) {
        return err;
    }
}

async function readFile(filePath, categoryTxt) {
    let results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            await processarCsv(results, categoryTxt);
        });
}

async function processarCsv(fileContent, categoryTxt) {
    let csvOutput = [];
    let fileName;

    for (let i = 0; i < fileContent.length; i++) {
        if (!fileName) {
            fileName = await getFileName(fileContent[i]['nome']);
        }

        var lineOutput = {
            vencimento: getDate(fileContent[i]['data1']),
            data_de_competencia: getDateC(fileContent[i]['data1']),
            cobranca_extraordinaria: getType(fileContent[i]['tipo']),
            valor: getValue(fileContent[i]['valor3']),
            unidade: fileContent[i]['apto'],
            bloco: fileContent[i]['bloco'],
            nosso_numero: fileContent[i]['boleto1'],
            complemento: fileContent[i]['acordo'],
            conta_categoria: getCategory(fileContent[i]['especie'], categoryTxt),
        };

        csvOutput.push(lineOutput);
    }

    await fs.writeFile('./src/files/output/exemploCobranca.csv', await convertToCsv(csvOutput),{enconding:'latin1',flag: 'w+'}, function (err) {
        if (err) throw err;
        console.log('Arquivo salvo!');
    });

    return fileName;
}

async function getFileName(field) {
    return field = field.replace(/ /g, "").replace(/\./g, "");
}

async function convertToCsv(data) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r\n');

    return csv;
}

function getCategory(data, categoryTxt) {
    if (!data) {
        return '';
    }

    categoryTxt = categoryTreatment(categoryTxt);
    defaultCategory = '1.1';

    categoryTxt.forEach(category => {
        if (category[0] == data) {
            defaultCategory = (category[1]);
        }
    });

    return defaultCategory;
}

function getValue(data) {
    if (!data) {
        return '';
    }

    return data.replace(',' , '.');
}

function getType(data) {
    if (!data) {
        return '';
    }

    if (data == 'P') {
        return 1;
    }

    return 0;
}

function getDateC(data) {
    if (!data)
        return '';

    return moment(data, 'DD-MMM-YY').subtract(1, 'months').format('DD/MM/YYYY');
}

function getDate(data) {
    if (!data)
        return '';

    return moment(data, 'DD-MMM-YY').format('DD/MM/YYYY');
}

function categoryTreatment(categoryTxt) {
    firstSplit = categoryTxt.split("\n");
    categoryArray = [];

    firstSplit.forEach(async category => {
        await categoryArray.push(category.split("="));
    })

    return categoryArray;
}
