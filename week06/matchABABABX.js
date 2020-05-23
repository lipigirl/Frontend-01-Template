function match(string) {
    let state = start;
    for (let item of string) {//for of 适用于数组、字符串
        state = state(item);
    }
    return state == end;
}

function start(item) {
    if (item == 'a') return foundA;
    else return start;
}

function foundA(item) {
    if (item == 'b') return foundB;
    else return start;
}

function foundB(item) {
    if (item == 'a') return foundA2;
    else return start;
}

function foundA2(item) {
    if (item == 'b') return foundB2;
    else return start;
}

function foundB2(item) {
    if (item == 'a') return foundA3;
    else return start;
}

function foundA3(item) {
    if (item == 'b') return foundB3;
    else return start;
}

function foundB3(item) {
    if (item == 'x') return end;
    else return foundB2(item);
}

function end(item) {
    return end;
}

match('abababx');//true
match('ababababx');//true