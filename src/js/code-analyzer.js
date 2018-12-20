import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
let bool =false;
let freeVars = new Map();
let funcParams = new Map();
let funcLocals = new Map();
let funcs =[];
let paramsNames =[];
let values =[];
let paintRed = [];
let paintGreen = [];


const init = () => {
    freeVars = new Map();
    funcParams = new Map();
    funcLocals = new Map();
    funcs =[];
    paramsNames =[];
    values =[];
    paintRed = [];
    paintGreen = [];
};


const parseCode = (codeToParse) => {
    init();
    let code= esprima.parseScript(codeToParse);
    return analyse_program(code);


};
const analyse_program = (code)=>{
    firstIter(code);
    let stringedProgram = escodegen.generate(secondIter(code));
    thirdIter(esprima.parseScript(stringedProgram,{loc:true}));
    return [stringedProgram,paintGreen,paintRed];
};

const firstIter = (parsedCode)=>{
    FindFreeVars(parsedCode.body);
};

const FindFreeVars = (CodeBody) => {
    let v ;CodeBody.forEach(function (element) {
        if(element.type ===  'VariableDeclaration'){
            v= element;
            addFreeVar(v.declarations);}
        else {
            if(element.type === 'FunctionDeclaration'){
                paramsNames= addFunc(element);
            }
            if(element.type === 'ExpressionStatement'){
                if(element.expression.type ==='CallExpression'){
                    // noinspection JSAnnotator
                    element.expression.arguments.forEach(function (ele) {
                        values.push(ele);
                    });
                }
            }
        }
    });
};

const addFreeVar = (vardec) => {
    vardec.forEach(function (ele) {
        freeVars.set(ele.id.name , ele.init);
    });
};

const addFunc= (func) => {
    let arr =[];
    funcs.push(func.id.name);
    func.params.forEach(function (ele) {
        arr.push(ele.name) ;
    });
    return arr;
};



const secondIter = (code) =>{
    let c= code;
    let a=[];
    let i=0;
    code.body.forEach(function (element) {
        if(element.type === 'FunctionDeclaration'){
            funcationAnalysis(element.params);
            c.body[i].body= subBody(element.body);
            i=i+1;
        }
    });
    c.body.forEach(function (ele) {
        if(ele.type === 'FunctionDeclaration'){
            a.push(ele);
        }
    });
    c.body = a;
    return c ;
};
const funcationAnalysis = (func)=>{
    let p = [];
    func.forEach(function (element) {
        p.push( element.name);
        funcParams.set(element.name,element);
    });
    return p;
};

const subBody =(block)=>{
    let b =block;
    let arr =[];
    block.body.forEach(function (ele) {
        let element=ele;
        toadd(element);
        if(ele.type === 'ExpressionStatement'){
            element.expression=ExprStament(ele.expression);
            if(element.expression!= null) {
                arr.push(element);
            }
        }
        if(ele.type === 'IfStatement'){
            arr.push(subLocals(ele));}
        arr = check_while(ele,arr);
        if(ele.type === 'ReturnStatement'){
            arr.push(subLocals(ele));}});
    b.body= arr;
    return b ;
};

const switchexp = (ele)=>{
    return subLocals(ele);
};

const addLocals= (ele) => {
    ele.forEach(function (dec) {
        funcLocals.set( dec.id.name,subLocals(dec.init));
    });
};


const  subLocals = (body)=>{
    return ftype(body.type)(body);
};

const subBinary = (body) => {
    body.left = subLocals(body.left);
    body.right= subLocals(body.right);
    return body;
};


const subUnary= (body) => {
    body.argument = subLocals(body.argument);
    return body;
};

const subArray = (body) => {
    let elems=[],i=0;

    body.elements.forEach(function (element) {
        elems[i]=subLocals(element);
        i=i+1;
    });
    body.elements=elems;
    return body;
};

const subMember = (body) => {
    let na = body.object.name;
    let indx = body.property.value;
    let val ;
    if(funcParams.has(na)){
        if(bool) {
            return funcParams.get(na).elements[indx];
        }
        else {return body;}
    }else {
        if (freeVars.has(na)) {
            val = freeVars.get(na);
            return val.elements[indx];
        } else {
            val = funcLocals.get(na);
            return val.elements[indx];
        }
    }
};


const subLiteral = (body) => {
    return body;
};


const subIdentifer = (body) => {
    if(funcParams.has(body.name)){
        if(bool){
            return funcParams.get(body.name);
        }
        return body;
    }
    if(funcLocals.has(body.name)){
        return funcLocals.get(body.name);
    }
    return freeVars.get(body.name);
};
const subUpdate= (body) => {
    if(body.operator === '++'){
        return {type: 'BinaryExpression',
            operator: '+',
            left:subLocals(body.argument)
            ,
            right: {
                type: 'Literal',
                value: 1,
                raw: '1'
            }};
    }
    return {type: 'BinaryExpression',
        operator: '-',
        left:subLocals(body.argument), right: {type: 'Literal', value: 1, raw: '1'}};
};
const   ftype =(type) => {
    let arrfunc = [];
    arrfunc['BinaryExpression'] = subBinary;
    arrfunc['UnaryExpression'] = subUnary;
    arrfunc['ArrayExpression'] = subArray;
    arrfunc['MemberExpression'] = subMember;
    arrfunc['Literal'] = subLiteral;
    arrfunc['Identifier'] = subIdentifer;
    arrfunc['UpdateExpression'] = subUpdate;
    arrfunc['IfStatement'] =  subIf ;
    arrfunc['ReturnStatement'] =subret ;
    arrfunc['BlockStatement'] = subBody;
    arrfunc['VariableDeclaration'] =subVars;
    return  arrfunc[type];

};

const subVars = (vars)=> {
    addLocals(vars.declarations);

};
const subret = (ret) => {
    let element = ret;
    element.argument= switchexp(ret.argument);
    return element;

};
const subIf = (element) =>{
    let ifexp = element;

    let Mparam = new Map(funcParams); /* the solution to the enviorment */
    let Mlocal =  new Map(funcLocals);
    ifexp.test= subLocals(ifexp.test);
    ifexp.consequent=subBody(ifexp.consequent);
    funcParams= Mparam;
    funcLocals = Mlocal;
    if(ifexp.alternate != null) {
        ifexp.alternate = subLocals(element.alternate);
    }
    return ifexp;
};
const ExprStament= (expr) => {
    let body = expr;
    let arrEle=[];
    if(expr.type === 'AssignmentExpression') {return assExpr(expr);}
    if(expr.type === 'UpdateExpression') {return appExpr(expr);}
    if(expr.type === 'SequenceExpression'){let bb=false;expr.expressions.forEach(function (els) {let v= ExprStament(els);if(v != null) {bb=true;arrEle.push(v);
    }
    });
    if(bb) {
        body.expressions = arrEle;
        return body;
    }
    else {
        return null;
    }
    }
    return body;
};

const getMember = (arrName, index, val) => {
    let a ;

    if(funcParams.has(arrName)){
        if(bool) {
            a = funcParams.get(arrName);
            a.elements[index] = val;
            funcParams.set(arrName, a);
            return val;}
        return val;}
    else {
        if(freeVars.has(arrName)){
            a=freeVars.get(arrName);
            a.elements[index]=val;
            freeVars.set(arrName,a);
            return null ;}
        a=funcLocals.get(arrName);
        a.elements[index]=val;
        funcLocals.set(arrName,a);
    }return null;};

const thirdIter = (code) =>{
    let c =null;
    bool =true;
    code.body.forEach(function (element) {
        if(element.type === 'FunctionDeclaration'){
            //arr=replace_vars(element.body);
            c=findIfs(replace_vars(element.body));
        }

    });
    return c;
};
const findIfs=(block)=> {
    let a=[];
    block.body.forEach(function (element) {
        if(element.type === 'IfStatement') {
            ValIf(element.test);
            findIfs(element.consequent);
            if (element.alternate != null) {
                alterif(element.alternate);
            }
        }
        if(element.type === 'WhileStatement'){
            findIfs(element.body);
        }
    });
    return a;
};

const alterif = (alt) =>{
    if(alt.type === 'BlockStatement'){
        findIfs(alt);
    }
    else{
        if(alt.type === 'IfStatement'){
            ValIf(alt.test);
            findIfs(alt.consequent);
            if (alt.alternate != null) {
                alterif(alt.alternate);
            }
        }
        else{

            findIfs(alt.body);

        }
    }
};
const replace_vars = (block) => {
    let i=0;
    paramsNames.forEach(function (ele) {
        funcParams.set(ele,values[i]);
        i=i+1;
    });
    return subBody(block);
};
const ValIf = (test) =>{
    let testie = escodegen.generate(test);
    if(eval(testie) === true){
        paintGreen.push(test.loc.start.line);
    }
    else {
        paintRed.push(test.loc.start.line);
    }


};

const assExpr = (expr) => {
    let body =expr;
    if(expr.left.type === 'MemberExpression') {
        body.right = getMember(expr.left.object.name,subLocals(expr.left.property).value,subLocals(expr.right));
        if(body.right === null) {return null;} else{return body;}}
    if (funcParams.has(expr.left.name)) {
        funcParams.set(expr.left.name,subLocals(expr.right));
        body.right=funcParams.get(expr.left.name);
        return body;
    }
    else {
        if (freeVars.has(expr.left.name)) {
            freeVars.set(expr.left.name,subLocals(expr.right));
            return null;
        }
        funcLocals.set(expr.left.name, subLocals(expr.right));
        return null;
    }
};

const appExpr = (expr) => {
    if (funcParams.has(expr.argument.name)) {
        funcParams.set(expr.argument.name, subLocals(expr));
        return {
            type: 'AssignmentExpression', operator: '=',
            left: expr.argument,
            right: funcParams.get(expr.argument.name)
        };

    }
    else {
        if(freeVars.has(expr.argument.name)){
            freeVars.set(expr.argument.name, subLocals(expr));
            return null;
        }
        funcLocals.set(expr.argument.name, subLocals(expr));
        return null;
    }
};

const toadd = (expr) => {
    if(expr.type === 'VariableDeclaration'){
        addLocals(expr.declarations);
    }
};

const check_while = (ele, arr) => {
    let element = ele ;
    if(ele.type === 'WhileStatement'){
        element.test = subLocals(element.test);
        element.body=subBody(element.body);
        arr.push(element);
    }
    return arr;
};
export {parseCode};
