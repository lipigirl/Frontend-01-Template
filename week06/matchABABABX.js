function match(string) {
    let state = start;
    for (let item of string) {
        state = state(item);
    }
    return state == end;
}

function start(item) {
    if (item == 'a') return foundB;
    else return start;
}

function foundB(item) {
    if (item == 'b') return foundA2;
    else return start;
}

function foundA2(item) {
    if (item == 'a') return foundB2;
    else return start;
}

function foundB2(item) {
    if (item == 'b') return foundA3;
    else return start;
}

function foundA3(item) {
    if (item == 'a') return foundB3;
    else return start;
}

function foundB3(item) {
    if (item == 'b') return foundX;
    else return start;
}

function foundX(item) {
    if (item == 'x') return end;
    else return foundA3(item);
}

function end(item) {
    return end;
}

match('abababx');//true
match('ababababx');//true