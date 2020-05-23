function match(string) {
    let state = start;
    for (let item of string) {
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
    if (item == 'c') return foundC;
    else return start;
}

function foundC(item) {
    if (item == 'a') return foundA2;
    else return start;
}

function foundA2(item) {
    if (item == 'b') return foundB2;
    else return start;
}

function foundB2(item) {
    if (item == 'x') return end;
    else return foundB(item);
}

function end(item) {
    return end;
}

match('abcabcabx');