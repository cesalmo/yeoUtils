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

            // crea string de salida
            var oResult = oArrayTypes.map(
                (a) => {
                    var sfname = a.trim().split(' ')[0];
                    var tabData = a.trim().split(' ')[1].split('-');


                    if (tabData.length === 2) {
                        // tabla-campo
                        var tfield = tabData[1];
                        var tname = tabData[0];
                    } else {
                        // tabla
                        var tfield = sfname;
                        var tname = tabData[0];
                    };

                    return `( fieldname = '${sfname}'  ref_table = '${tname}' ref_field = '${tfield}' scrtext_m = TEXT-010 scrtext_s = TEXT-010 scrtext_l = TEXT-010 COLTEXT = TEXT-010 )"tech = abap_true edit = abap_true  checkbox = abap_true inttype = 'D' )`
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
};