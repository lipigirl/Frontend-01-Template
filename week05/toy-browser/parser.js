const EOF = Symbol('EOF');

function data(item) {
    if (item == "<") {
        return tagOpen;
    }
    else if (item == EOF) {
        return;
    } else {
        return data;
    }
}

function tagOpen(item) {
    if (item == '/') return endTagOpen;
    else if (item.match(/^[a-zA-Z]/)) return tagName(item);
    else return;
}

function endTagOpen(item) { }

function tagName(item) {
    if (item.match(/^[\t\n\f]/)) return;
    else if (item) return;
    else if (item) return;
    else return;
}

function beforeAttributeName(item) { }
function selftClosingStartTag(item) { }

// 接受html文本作为参数 返回DOM树
module.exports.parseHTML = function parseHTML(html) {
    let state = data;
    for (let item of html) {
        state = state = (item);
    }
    state = state(EOF);
}