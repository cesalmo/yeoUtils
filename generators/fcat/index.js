var Generator = require('yeoman-generator');

module.exports = class extends Generator {


    async main() {

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
        var sTypes = this.fs.read(this.contextRoot + '/' + nombreArchivo);
        var sTypesNoSpaces = sTypes.replace(/\s+/g, ' ').trim();

        // elimina ultima coma si la hay
        if (sTypesNoSpaces[sTypesNoSpaces.length - 1] === ',') {
            var sTypesNoSpaces2 = sTypesNoSpaces.substring(0, sTypesNoSpaces.length - 1);
        } else {
            sTypesNoSpaces2 = sTypesNoSpaces;
        }
        // crea array
        var oArrayTypes = sTypesNoSpaces2.split(',');

        oArrayTypes.map(
            (a) => console.log(a)
            )

      var cc = oArrayTypes.map(
            (a) => { 
                var sfname = a.trim().split(' ')[0];
                var tabData = a.trim().split(' ')[1].split('-');
                var tfield = tabData[0];
                if (tabData[1]){ var tname = tabData[1] };
                console.log( `(  tabname = '1' fieldname = '${sfname}'  ref_table = '${tfield}' ref_field = '${tname}' )` )

                }
            )


    }

    writing() {

    }
};