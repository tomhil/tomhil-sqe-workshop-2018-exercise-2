import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        paint(parsedCode[0],parsedCode[1],parsedCode[2]);
        $('#parsedCode').val(JSON.stringify(parsedCode[0], null, 2));
    });
});

const paint = (codeS,greenArry,redArry) =>{
    let stringedCode='<html>\n' + '<head><style type="text/css"> tab { padding-left: 2em; }</style></head>';
    stringedCode = stringedCode+ paint_body(codeS,greenArry,redArry,'<body><p>')+'</p></body></html>';
    document.body.innerHTML = stringedCode.fixed();
    return codeS;
};

const paint_body =(code,green,red,result)=>{
    let counter = 0;
    let line = '';
    while(code!==''){
        counter++;
        let i = code.indexOf('\n');
        if(i===-1){
            result=result+ code;break;}
        line = code.substring(0, i).replace('    ','<tab>');
        line=line.substring(0,i+4).replace(/\s\s/ ,'&nbsp;&nbsp;&nbsp;&nbsp;');
        code = code.substring(i + 1);
        if(green.includes(counter)) {result=result+'<mark style="background-color: #028000">'+line+'</mark>';}

        else
        if (red.includes(counter)) {result=result+'<mark style="background-color: red">'+line+'</mark>';}
        else result=result+line;
        result=result+'<br>';
    }
    return result;
};

