// 找到字符‘a'
function matchA(string) {
    for (let item of string) {
        if (item == 'a') return true;
    }
}
// 找到字符‘ab'
function matchAB(string) {
    let foundA = false;
    for (let item of string) {
        if (item == 'a') {
            foundA = true;
        }
        else if (foundA && item == 'b') {
            return true;
        }
        else {
            foundA = false;
        }
    }
    return false;
}
// 找到字符'abcdef'
function matchABCDEF(string) {
    let foundA = false,
        foundB = false,
        foundC = false,
        foundD = false,
        foundE = false,
        foundF = false;
    for (let item of string) {
        if (item == 'a') foundA = true;
        else if (foundA && item == 'b') foundB = true;
        else if (foundB && item == 'c') foundC = true;
        else if (foundC && item == 'd') foundD = true;
        else if (foundD && item == 'e') foundE = true;
        else if (foundE && item == 'f') return true;
        else {
            foundA = false;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
            foundF = false;
        }
    }
    return false;
}
matchABCDEF('abcdeef');//true 两次e都进入了(foundD && item == 'e')

// 状态机
function match(string) {
    // state表示当前状态
    let state = start;
    for (item of string) {
        state = state(item);
    }
    return state === end;
}

function start(item) {
    if (item === 'a')
        return foundA;
    else
        return start;//切回自身 状态不变
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
function end(item) {
    return end;
}
match('abxc');