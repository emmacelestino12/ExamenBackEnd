const express = require('express');
const app = express();

const cors = require('cors');

const fs = require('fs');

const headerTemp = [];
const headers = [];
const radBaseTMP = [];
const radioBase = [];

app.use(cors());

app.listen(3000, () => {

    var path = "assets/radiobasesPrueba.csv"
    var rs = fs.readFileSync(path, 'utf8');
    var rows = rs.split(/\n/);

    headers.push('Radiobase');

    if (rows instanceof Array)
        rows.forEach(row => {
            var colum = row.replace(/\r/, '');
            var col = colum.split(',');
            headerTemp.push(col[1]);
            radBaseTMP.push({ c1: col[0], c2: col[1], c3: col[2], c4: col[3] });
            radioBase.push(col[0])
        });
    headerTemp.shift();
    radBaseTMP.shift();
    radioBase.shift();
    if (headerTemp instanceof Array)
        headerTemp.forEach((value, index) => {
            if (index === 0)
                headers.push(value);
            else
            if (!headers.includes(value))
                headers.push(value);
        });
    console.log('Corriendo el servidor');

});

app.get('/radiobase', (req, res) => {
    var rows = [];
    radioBase.forEach(category => {
        var tmp = radBaseTMP.filter(cat => cat.c1 == category);
        if (tmp.length > 0) {
            var fila = new StringBuffer();
            fila.append('{"radiobase":"' + tmp[0].c1)

            tmp.forEach((ro) => {
                fila.append('","' + ro.c2 + '":"' + ro.c4);
            });
            fila.append('"}');
            rows.push(JSON.parse(fila.toString()));
        }

    });


    res.json({
        data: {
            headers: headers,
            rows: rows
        }
    });

});
var StringBuffer = function() {
    this.buffer = [];
    this.index = 0;
};

StringBuffer.prototype = {
    append: function(s) {
        this.buffer[this.index] = s;
        this.index += 1;
        return this;
    },

    toString: function() {
        return this.buffer.join();
    }
};