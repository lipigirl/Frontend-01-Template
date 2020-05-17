/**
 * 用FSM（有限状态机）实现HTML的分析
 * 在HTML标准中，已经规定了HTML的状态
 * Toy-Browser只挑选其中一部分状态，完成一个最简单版本
 * 标签结束状态提交标签属性
 */

//词（token）
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{
    type: 'document',
    children: []
}];

function emit(token) {
    // if(token.type!='text')
    console.log(token);
}

const EOF = Symbol('EOF');//end of file

// 第一个状态
function data(item) {
    if (item == "<") {
        return tagOpen;//开始标签
    }
    else if (item == EOF) {
        emit({
            type: 'EOF'
        });
        return;
    }
    else {
        //\n
        emit({
            type: 'text',
            content: item
        });
        return data;
    }
}

function tagOpen(item) {
    if (item == '/') {
        return endTagOpen;//结束标签
    }
    else if (item.match(/^[a-zA-Z]$/)) {
        //初始化currentToken，其中tagName为''
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(item);
    }
    else {
        emit({
            type: 'text',
            content: item
        });
        return;
    }
}

function tagName(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }
    else if (item == '/') {
        return selftClosingStartTag;
    }
    else if (item.match(/^[a-zA-Z]$/)) {
        //在遇到结束符前，不断完善currentToken的tagName
        currentToken.tagName += item.toLowerCase();
        return tagName;
    }
    else if (item == '>') {
        emit(currentToken);
        return data;
    }
    else {
        currentToken.tagName += item;
        return tagName;//其他情况返回自身
    }
}

/**
 * 处理属性
 */
function beforeAttributeName(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;//<div    name="hhj">在没有遇到字符前 如果遇到空格 会认为一直在等待attribute name
    } else if (item == '/' || item == '>' || item == EOF) {
        return afterAttributeName(item);
    } else if (item == '==') {

    } else {
        currtAttribute = {
            name: '',
            value: ''
        }
        return attributeName(item);
    }
}

function attributeName(item) {
    if (item.match(/^[\t\n\f ]$/) || item == '/' || item == '>' || item == EOF) {
        return afterAttributeName(item);
    } else if (item == '=') {
        return beforeAttributeValue;
    } else if (item == '\u0000') {

    } else if (item == '\"' || item == "'" || item == '<') {

    } else {
        currentAttribute.name += item;
        return attributeName;
    }
}

function beforeAttributeValue(item) {
    if (item.macth(/^[\t\n\f ]$/) || item == '/' || item == '>' || item == EOF) {
        return beforeAttributeValue;
    } else if (item == "\"") {
        return doubleQuoteAttributeValue;
    } else if (item == "\'") {
        return singleQuotedAttributeValue;
    } else if (item == '>') {
        // return data;
    } else {
        return UnquotedAttributeValue;
    }
}

function afterAttributeName(item) {

}

function doubleQuoteAttributeValue(item) {

}

function singleQuotedAttributeValue(item) {

}

function afterQuotedAttributeValue(item) {

}

function UnquotedAttributeValue(item) {

}

/**
 * 自封闭标签
 */
function selftClosingStartTag(item) {
    if (item == '>') {
        currentToken.isSelfClosing = true;
        return data;
    }
    else if (item == EOF) {

    } else {

    }
}

function endTagOpen(item) {
    if (item.match(/^[a-zA-Z]$/)) {

    } else if (item == '>') {

    } else if (item == EOF) {

    }
    else {

    }
}

// 接受html文本作为参数 返回DOM树
module.exports.parseHTML = function parseHTML(html) {
    // 创建状态机
    let state = data;
    for (let item of html) {
        console.log(item);
        state = state(item);
    }
    state = state(EOF);//标识文件结尾
}