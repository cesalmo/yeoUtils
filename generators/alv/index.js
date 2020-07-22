var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    async main() {

        this.oSufijo = await this.prompt(
            [{
                type: "input",
                name: "sufijo",
                message: "sufijo a anexar a los objetos",
                default: "_1",
                store: false
            }, {
                type: "input",
                name: "filename",
                message: "npmbre de archivo .txt a crear",
                default: "alv",
                store: false
            }]
        );

     
    }

    _private_method_util() {

    }


    writing() {

        
        var nombreArchivo = this.oSufijo.filename + '.txt';
        // path desde donde ha sido llamado yeoman
        // @ts-ignore
        var destinoArchivo = this.contextRoot + '/' + nombreArchivo;
        this.fs.copyTpl(
            this.templatePath('alv1.txt'),
            destinoArchivo,
            {  sufijo : this.oSufijo.sufijo } 
          );
    }

};