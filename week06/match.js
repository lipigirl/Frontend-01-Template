function match(string) {
    let state = start;
    for (item in string) {
        state = state(item);
    }
    return state === end;
}

function start(item) {
    if (item === 'a')
        return foundA;
    else
        return start;
}

function foundA(item) {
    if (item === 'b')
        return foundB;
    else
        return start;
}

function foundB(item) {
    if (item === 'c')
        return end;
    else
        return start;
}
function end() {
    return end;
}