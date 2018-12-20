import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')[0]).substring(1,JSON.stringify(parseCode('')[0]).length-1),
            ''
        );
    });

    it('test1', () => {
        assert.equal(
            JSON.stringify(parseCode(test1())[0]).substring(1,JSON.stringify(parseCode(test1())[0]).length-1),
            sol1()
        );
    });

    it('test2', () => {
        assert.equal(
            JSON.stringify(parseCode(test2())[0]).substring(1,JSON.stringify(parseCode(test2())[0]).length-1),
            sol2()
        );
    });

    it('test3', () => {
        assert.equal(
            JSON.stringify(parseCode(test3())[0]).substring(1,JSON.stringify(parseCode(test3())[0]).length-1),
            sol3()
        );
    });

    it('test4', () => {
        assert.equal(
            JSON.stringify(parseCode(test4())[0]).substring(1,JSON.stringify(parseCode(test4())[0]).length-1),
            sol4()
        );
    });

    it('test5', () => {
        assert.equal(
            JSON.stringify(parseCode(test5())[0]).substring(1,JSON.stringify(parseCode(test5())[0]).length-1),
            sol5()
        );
    });

    it('test6', () => {
        assert.equal(
            JSON.stringify(parseCode(test6())[0]).substring(1,JSON.stringify(parseCode(test6())[0]).length-1),
            sol6()
        );
    });

    it('test7', () => {
        assert.equal(
            JSON.stringify(parseCode(test7())[0]).substring(1,JSON.stringify(parseCode(test7())[0]).length-1),
            sol7()
        );
    });

    it('test8', () => {
        assert.equal(
            JSON.stringify(parseCode(test8())[0]).substring(1,JSON.stringify(parseCode(test8())[0]).length-1),
            sol8()
        );
    });

    it('test9', () => {
        assert.equal(
            JSON.stringify(parseCode(test9())[0]).substring(1,JSON.stringify(parseCode(test9())[0]).length-1),
            sol9()
        );
    });




});

const test1=()=>{
    return 'let p=5;' +
        'function foo (x,y,z) { ' +
        'let f =x+2; while(f > 3){' +
        ' let b=[1,2,3];' +
        ' let gg = p ; if(true){' +
        ' if(y<1){ ' +
        'return y;' +
        ' return b[1];' +
        ' }' +
        ' }' +
        ' return x;' +
        ' return z;' +
        ' }' +
        ' }' +
        ' foo(2,7,3);';

};

const sol1=() => {
    return 'function foo(x, y, z) {\\n    while (x + 2 > 3) {\\n        if (true) {\\n            if (y < 1) {\\n                return y;\\n                return 2;\\n            }\\n        }\\n        return x;\\n        return z;\\n    }\\n}' ;
};

const test2=()=>{
    return 'function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    x++,a=0,z=0;\n' +
        '    if (b < z) {\n' +
        '        c = c + 5;\n' +
        '        return x + y + z + c;\n' +
        '    } else if (b < z * 2) {\n' +
        '        c = c + x + 5;\n' +
        '        return x + y + z + c;\n' +
        '    } else {\n' +
        '        c = c + z + 5;\n' +
        '        return x + y + z + c;\n' +
        '    }\n' +
        '}\n' +
        'foo(1,2,3);';

};

const sol2=() => {
    return 'function foo(x, y, z) {\\n    x = x + 1, z = 0;\\n    if (x + 1 + y < 0) {\\n        return x + 1 + y + 0 + (0 + 5);\\n    } else if (x + 1 + y < 0 * 2) {\\n        return x + 1 + y + 0 + (0 + (x + 1) + 5);\\n    } else {\\n        return x + 1 + y + 0 + (0 + 0 + 5);\\n    }\\n}';
};



const test3=()=>{
    return 'function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    while (a < z) {\n' +
        '        c = a + b;\n' +
        '        z = c * 2;\n' +
        '    }\n' +
        '    \n' +
        '    return z;\n' +
        '}\n' +
        'foo(1,2,3);';

};

const sol3=() => {
    return 'function foo(x, y, z) {\\n    while (x + 1 < z) {\\n        z = (x + 1 + (x + 1 + y)) * 2;\\n    }\\n    return (x + 1 + (x + 1 + y)) * 2;\\n}';
};


const test4=()=>{
    return 'let p=5;\n' +
        'function foo (x,y,z) { \n' +
        'let f =x+2; while(f > 3){\n' +
        ' let b=[1,2,3];\n' +
        ' let gg = p ; if(true){\n' +
        ' if(y<1){ \n' +
        'return y;\n' +
        ' return b[1];\n' +
        ' }\n' +
        ' }\n' +
        ' return x;\n' +
        ' return z;\n' +
        ' }\n' +
        ' }\n' +
        ' foo(2,7,3);';

};

const sol4=() => {
    return 'function foo(x, y, z) {\\n    while (x + 2 > 3) {\\n        if (true) {\\n            if (y < 1) {\\n                return y;\\n                return 2;\\n            }\\n        }\\n        return x;\\n        return z;\\n    }\\n}';
};



const test5=()=>{
    return 'let p=5;\n' +
        'function foo (x,y,z,w) { \n' +
        'let f =x+2; while(f > 3){\n' +
        ' let b=[1,2,3];\n' +
        ' let gg = p ; if(true){\n' +
        ' if(y<1){ \n' +
        'return y;\n' +
        ' return b[1];\n' +
        ' }\n' +
        ' }\n' +
        'let g = [true ,true ,true];\n' +
        'return g;\n' +
        '\n' +
        'if(g[1]){\n' +
        '   return g[1];\n' +
        '}\n' +
        'else{\n' +
        ' return x;\n' +
        ' return w;\n' +
        ' return z;\n' +
        '}\n' +
        '\n' +
        '\n' +
        ' }\n' +
        ' }\n' +
        ' foo(2,7,3,[true,false,"str"]);';
};

const sol5=() => {
    return 'function foo(x, y, z, w) {\\n    while (x + 2 > 3) {\\n        if (true) {\\n            if (y < 1) {\\n                return y;\\n                return 2;\\n            }\\n        }\\n        return [\\n            true,\\n            true,\\n            true\\n        ];\\n        if (true) {\\n            return true;\\n        } else {\\n            return x;\\n            return w;\\n            return z;\\n        }\\n    }\\n}';
};

const test6 = () => {
    return 'let p=[2,3];\n' +
        'function foo (x,y,z,w) { \n' +
        'let f =x+2; while(f > 3){\n' +
        ' let b=[1,2,3];\n' +
        ' let gg = p ; if(true){\n' +
        ' if(y<1){ \n' +
        'return y;\n' +
        ' return b[1];\n' +
        ' }\n' +
        ' }\n' +
        'let g = [true ,true ,true];\n' +
        'return p[1];\n' +
        '\n' +
        'if(g[1]){\n' + '   return g[1];\n' + '}\n' + 'else{\n' + ' return x;\n' + ' return w;\n' + ' return z;\n' + '}\n' + '\n' + '\n' + ' }\n' + ' }\n' +
        ' foo(2,7,3,[true,false,"str"]);';
};

const sol6=() => {
    return 'function foo(x, y, z, w) {\\n    while (x + 2 > 3) {\\n        if (true) {\\n            if (y < 1) {\\n                return y;\\n                return 2;\\n            }\\n        }\\n        return 3;\\n        if (true) {\\n            return true;\\n        } else {\\n            return x;\\n            return w;\\n            return z;\\n        }\\n    }\\n}' ;
};

const test7=() =>{
    return 'function foo (x,y){\n' +
      '    let a = -1 ;\n' +
      '    return a;\n' +
      '}';
};


const sol7 = () =>{
    return 'function foo(x, y) {\\n    return -1;\\n}';
};

const test8 = () => {
    return 'function foo(){\n' +
        '    let f=0;\n' +
        '    let ft=1;\n' +
        '    while(ft*2 >f) {\n' +
        '      if(ft == 4){\n' +
        '        return true;\n' +
        '      }\n' +
        '     return ft-1;\n' +
        '    }  \n' +
        '\n' +
        '}';
};

const sol8 = () => {
    return 'function foo() {\\n    while (1 * 2 > 0) {\\n        if (1 == 4) {\\n            return true;\\n        }\\n        return 1 - 1;\\n    }\\n}';
};

const test9= () => {
    return 'function foo (x,y) {\n' +
        '    let a = x+5;\n' +
        '    let b = y+7 ;\n' +
        '    if(a>10){\n' +
        '      a=1;\n' +
        '      return a;\n' +
        '    }\n' +
        '    else{\n' +
        '     return a;\n' +
        '    }\n' +
        '}\n' +
        'foo(1,2)';
};

const sol9 = () =>{
    return'function foo(x, y) {\\n    if (x + 5 > 10) {\\n        return 1;\\n    } else {\\n        return x + 5;\\n    }\\n}';
};

