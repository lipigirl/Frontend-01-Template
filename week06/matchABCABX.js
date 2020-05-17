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
    if (item == 'b') return foundC;
    else return start;
}

function foundC(item) {
    if (item == 'c') return foundA;
    else return start;
}

function foundA(item) {
    if (item == 'a') return foundB2;
    else return start;
}

function foundB2(item) {
    if (item == 'b') return foundX;
    else return start;
}

function foundX(item) {
    if (item == 'x') return end;
    else return foundC(item);
}

function end(item) {
    return end;
}

match('abcabcabx');