var Generator = require('yeoman-generator');

/**
 *  Input de tipo:
 *  kunnr kna1-kunnr,
 *      ó
 *  kunnr kna1,
 * 
 */

module.exports = class extends Generator {

    async prompting() {

        this.oPreguntas = await this.prompt([
            {
                type: "input",
                name: "nombreArchivoInput",
                message: "archivo con tipos a importar",
                default: "types.txt",
                store: false
            },
            {
                type: "input",
                name: "nombreArchivoOutput",
                message: "archivo con fieldcatalog",
                default: "fcat.txt",
                store: false
            },
            {
                type: "input",
                name: "numeroTextos",
                message: "Nº de comienzo para textos",
                default: "31",
                store: false
            },
            {
                type: "input",
                name: "nombreTextosOutput",
                message: "archivo con textos",
                default: "textos.txt",
                store: false
            }
        ]);
    };

    processing() {
        var nombreArchivo = this.oPreguntas.nombreArchivoInput;

        try {
            // @ts-ignore
            var sTypes = this.fs.read(this.contextRoot + '/' + nombreArchivo);

            var sTypesNoSpaces = sTypes.replace(/\s+/g, ' ').trim();

            // elimina ultima coma si la hay
            if (sTypesNoSpaces[sTypesNoSpaces.length - 1] === ',') {
                var sTypesNoSpaces2 = sTypesNoSpaces.substring(0, sTypesNoSpaces.length - 1).toUpperCase();
            } else {
                sTypesNoSpaces2 = sTypesNoSpaces.toUpperCase();
            }
            // crea array
            var oArrayTypes = sTypesNoSpaces2.split(',');

            this.nTextos = Number.parseInt(this.oPreguntas.numeroTextos)

            // procesa textos
            var oTextos = oArrayTypes.map((a) => {

                var nTexto1 = this.nTextos
                var nTexto2 = this.nTextos + 1
                this.nTextos += 2
                var sPadTexto1 = this._private_method_pad(nTexto1)
                var sPadTexto2 = this._private_method_pad(nTexto2)

                try {
                    // si existe TEXT_S -> recupera, elimina y concatena
                    var ind1 = a.indexOf("TEXT_S")

                    if (ind1 > -1) {
                        var ind12 = ind1 + 8;
                        var ind13 = a.indexOf("\"", ind12)
                        var sText_s = a.slice(ind12, ind13)
                        var sSub1 = a.substr(0, ind1) + a.substr(ind13 + 2) + ` TEXT_S=${sPadTexto1}` // string sin TEXT_S
                    } else {
                        sSub1 = a + ` TEXT_S=${sPadTexto1}`
                        sText_s = ``
                    }

                    // si existe TEXT_L -> recupera, elimina y concatena
                    var ind2 = sSub1.indexOf("TEXT_L")
                    if (ind2 > -1) {
                        var ind22 = ind2 + 8
                        var ind23 = sSub1.indexOf("\"", ind22);
                        var sText_l = sSub1.slice(ind22, ind23)
                        var sSub2 = sSub1.substr(0, ind2) + sSub1.substr(ind23 + 2) + ` TEXT_L=${sPadTexto2}`// string sin TEXT_L
                    } else {
                        sSub2 = sSub1 + ` TEXT_L=${sPadTexto2}`
                        sText_l = ``
                    }

                } catch { }

                return [`${sSub2}`, `${sPadTexto1} ${sText_s}`, `${sPadTexto2} ${sText_l}`]

            });


            var oArrayTypes2 = oTextos.map( 
                (b) => { return b[0] });

                debugger;
            // crea string de salida
            var oResult = oArrayTypes2.map(
                (a) => {
                    // elimina TEXT_S
                    var ind1 = a.indexOf("TEXT_S")
                    var sSub1 = a.substr(0, ind1) + a.substr(ind1 + 11)
                    var ind2 = sSub1.indexOf("TEXT_L")
                    var sSub2 = sSub1.substr(0, ind2) + sSub1.substr(ind2 + 11)

                    var sfname = sSub2.trim().split(' ')[0];
                    try {
                        var tabData = sSub2.trim().split(' ')[1].split('-');

                        if (tabData.length === 2) {
                            // tabla-campo
                            var tfield = tabData[1];
                            var tname = tabData[0];
                            var sRef = `ref_table = '${tname}' ref_field = '${tfield}'`
                        } else if (tabData.length === 1) {
                            // tabla
                            tfield = sfname;
                            tname = tabData[0];
                            sRef = `ref_table = '${tname}' ref_field = '${tfield}'`
                        };
                    } catch (e) {
                        // nada  intlen = 10
                        sRef = `inttype = 'D'`
                    };

                    return `(   fieldname = '${sfname}'  ${sRef} scrtext_m = TEXT-010 scrtext_s = TEXT-010 scrtext_l = TEXT-010 COLTEXT = TEXT-010 )"tech = abap_true edit = abap_true  checkbox = abap_true )`
                });

            this.sResult = oResult.join('\n');
        } catch (e) {
            this.sResult = "";
        }


    }

    writing() {
        var nombreArchivo = this.oPreguntas.nombreArchivoOutput;
        // @ts-ignore
        var destinoArchivo = this.contextRoot + '/' + nombreArchivo;
        this.fs.write(destinoArchivo, this.sResult);
    }

    _private_method_pad(num) {
        var s = num + "";
        while (s.length < 3) s = "0" + s;
        return s;
    }


};