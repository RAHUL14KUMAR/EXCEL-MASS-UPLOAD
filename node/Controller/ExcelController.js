const ExcelJS = require("exceljs");
const fs = require("fs/promises");

const getupload = (req, res) => {
    res.send('GET request for upload endpoint');
}

const postupload = async(req, res) => {
    const file = req.file;
    console.log('Uploaded file:', file);

    try{
        const workbook= new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.path);
        const worksheet= workbook.worksheets[0];

        if (!worksheet) {
            return res.status(400).json({
                message: "Excel sheet is empty"
            });
        }


        const headers = worksheet.getRow(1).values.slice(1);
        console.log('Headers:', headers);

        const rescord=[];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row.getCell(index + 1).value;
                });
                rescord.push(rowData);
            }
        });

        console.log('Records length', rescord.length);
        for (const record of rescord) {
            console.log('Record:', record);
        }

        res.send('POST request for upload endpoint length: ' + rescord.length);

    }catch(err){
        console.error('Error processing the uploaded file:', err);
        res.status(500).send('Error processing the uploaded file');
    }
}

module.exports = {
    getupload,
    postupload
}