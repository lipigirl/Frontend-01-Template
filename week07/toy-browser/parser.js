// css parse插件
const css = require("css");

//end of file
const EOF = Symbol("EOF");

const layout = require("./layout.js")

/**
 * 用FSM（有限状态机）实现HTML的分析
 * 在HTML标准中，已经规定了HTML的状态
 * Toy-Browser只挑选其中一部分状态，完成一个最简单版本
 * 标签结束状态提交标签属性
 * 词（token）
 */

/**
 * type(startTag|endTag)
 * tagName
 * name(属性名)
 * value(属性值)
 * isSelfClosing
 */
let currentToken = null;

/**
 * 存放currentToken的name和value对
 */
let currentAttribute = null;

let currentTextNode = null;

/**
 * 栈（存放所有标签及其属性）
 */
let stack = [{
    type: 'document',
    children: []
}];

/**
 * 存放css规则
 */
let rules = [];

/**
 * 调用css parser来分析css规则
 * @param {*} text 
 */
function addCSSRules(text) {
    let ast = css.parse(text);
    // console.log(JSON.stringify(ast, null, 4));//把 JavaScript 对象转换为字符串。使用4个空格缩进
    rules.push(...ast.stylesheet.rules);
}

/**
 * CSS-5 【计算与当前元素是否匹配】
 * id选择器、class选择器、标签选择器
 * @param {*} element 
 * @param {*} selector 
 */
function match(element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }

    // id选择器
    if (selector.charAt(0) == "#") {
        let attr = element.attributes.filter(({ name }) => name === "id")[0];
        if (attr && attr.value === selector.replace("#", "")) {
            return true;
        }
    }
    // class选择器
    else if (selector.charAt(0) == ".") {
        let attr = element.attributes.filter(({ name }) => name === "class")[0];
        if (attr && attr.value === selector.replace(".", "")) {
            return true;
        }
    }
    // 标签选择器
    else {
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}

/**
 * 优先级
 * specificity指定的具体的程度
 * specificity是个四元组，分别是内嵌，标签，class选择器，id选择器，越左权重越高
 * 0表示高位
 * 内嵌样式优先级，最高，为0
 * @param {*} selector 
 */
function specificity(selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(" ");
    for (let part of selectorParts) {
        if (part.charAt(0) == "#") {
            p[1] += 1;
        } else if (part.charAt(0) == ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    // 从高位开始往低位算，如果高位计算出了就return [0,1,0,2] [0,0,0,3]
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}

/**
 * CSS-3 【获取父元素序列】 
 * 我们必须知道元素的所有父元素才能判断元素与规则是否匹配；
 * computeCSS必然造成重排，重排一定会触发重绘
 * @param {*标签} element 
 */
function computeCSS(element) {
    let elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    // CSS-4 【拆分选择器】 选择器也要从当前元素向外排列。复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列
    // 每来一个element 都将element与所有rules进行匹配 直到element中的attribute name与rule中的标签相等 才算匹配到了
    // 根据rules element 计算css
    for (let rule of rules) {
        // 从内向外 ["img", "div", "body"]
        let selectorParts = rule.selectors[0].split(" ").reverse();
        // selectorParts[0]为当前元素
        if (!match(element, selectorParts[0])) {
            continue;//进行下一条规则
        }

        let matched = false;

        // i表示每一个element
        // j表示每一个selector
        // 若element和selector匹配，selector往外层走一层，寻找#myid外能与div选择器对应的element，找到后再往外移动一层
        let j = 1;
        for (let i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        // 已遍历完所有当前rule的所有selector
        if (j >= selectorParts.length) {
            matched = true;
        }
        if (matched) {
            // 计算rule规则中selector的优先级 例如body div img sp=[0,0,0,3]
            let sp = specificity(rule.selectors[0]);
            // CSS-6 【生成computed属性】 一旦匹配，就应用选择器到元素上，形成computedStyle，反之不做操作
            let computedStyle = element.computedStyle;

            // declarations声明 例如width:30px
            for (let item of rule.declarations) {
                if (!computedStyle[item.property]) {//比如//width属性
                    computedStyle[item.property] = {}
                }

                if (!computedStyle[item.property].specificity) {
                    computedStyle[item.property].value = item.value;
                    computedStyle[item.property].specificity = sp;
                }
                // CSS-7【确定规则覆盖关系】根据specifity和后来优先规则覆盖
                else if (compare(sp, computedStyle[item.property].specificity) > 0) {
                    computedStyle[item.property].value = item.value;
                    computedStyle[item.property].specificity = sp;
                }
            }
        }
    }

    // 针对inline style
    /* let inlineStyle = element.attributes.filter(p => p.name == "style");
    parse("{" + inlineStyle + "}")
    sp = [1, 0, 0, 0]
    for (let item of sp) { } */

}
/**
 * 从标签构建DOM树的基本技巧是使用栈
 * 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
 * 自封闭节点可视为入栈后立刻出栈
 * 任何元素的父元素是它入栈前的栈顶
 * 
 * 栈顶元素就是当前节点；
 * 遇到属性，就添加到当前节点；
 * 遇到文本节点，如果当前节点是文本节点，则跟文本节点合并，否则入栈成为当前节点的子节点；
 * 遇到 tag start 就入栈一个节点；
 * 遇到 tag end 就出栈一个节点。
 */
function emit(token) {

    let top = stack[stack.length - 1];//后进先出

    if (token.type == "startTag") {
        let element = {
            type: "element",
            attributes: [],
            children: [],
        }
        element.tagName = token.tagName;

        for (let p in token) {
            if (p != "type" || p != "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        // CSS-2 【添加调用】
        // ++++++++++++当创建element后，立即compute css++++++++++++
        // 理论上，我们分析一个元素时，所有CSS规则(style属性)已经收集完毕；
        // 在真实浏览器中，可能遇到写在 body 的 style 标签，需要重新 CSS 计算的情况，这里我们忽略
        computeCSS(element);

        top.children.push(element);

        if (!token.isSelfClosing) {
            stack.push(element)
        }

        currentTextNode = null;

    }
    else if (token.type == "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            // CSS-1 【收集CSS规则】
            // ++++++++++++遇到style标签(head-style)时，执行添加CSS规则的操作++++++++++++
            if (top.tagName == "style") {
                addCSSRules(top.children[0].content);
            }
            layout(top);
            stack.pop();
        }
        currentTextNode = null;
    }
    else if (token.type == 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

/**
 * 初始状态
 */
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
        //如\n
        emit({
            type: 'text',
            content: item
        });
        return data;
    }
}

/**
 * 开始标签
 * @param {*} item 
 */
function tagOpen(item) {
    if (item == '/') {
        return endTagOpen;//结束标签
    }
    else if (item.match(/^[a-zA-Z]$/)) {
        //初始化currentToken，进入tagName状态
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

/**
 * 第三部分：解析HTML标签
 * 主要的标签有：开始标签、结束标签和自封闭标签
 */
function tagName(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }
    else if (item == '/') {
        return selftClosingStartTag;
    }
    else if (item.match(/^[a-zA-Z]$/)) {
        //在遇到结束符前，不断完善currentToken的tagName，
        currentToken.tagName += item.toLowerCase();
        return tagName;
    }
    else if (item == '>') {
        emit(currentToken);//<head>没有attribute 所以可以直接emit currentToken。在tagName状态中，只要遇到>，就代表token完成
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
        return afterAttributeName(item);//此时传入的是>，将>作为入参带入下一个状态
    } else if (item == '=') {

    } else {
        // 存储Attributes前，先初始化currentAttribute
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(item);//此时传入的item为attribute中的字母，将此字母作为入参，传送到下一个状态机attributeName
    }
}

/**
 * 处理属性名
 * @param {} item 
 */
function attributeName(item) {
    if (item.match(/^[\t\n\f ]$/) || item == '/' || item == '>' || item == EOF) {
        return afterAttributeName(item);
    } else if (item == '=') {
        return beforeAttributeValue;
    } else if (item == '\u0000') {

    } else if (item == '\"' || item == "'" || item == '<') {

    } else {
        currentAttribute.name += item;//将接受的item逐步完善attribute中的name
        return attributeName;
    }
}

function afterAttributeName(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (item == "/") {
        return selftClosingStartTag;
    } else if (item == "=") {
        return beforeAttributeValue;
    } else if (item == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (item == EOF) {

    } else {
        // ???
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(item);
    }
}

/**
 * 等待单引号或双引号或没引号开头
 * 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理
 * 处理属性的方式跟标签类似
 * 属性结束时，我们要把属性加到标签token上
 */
function beforeAttributeValue(item) {
    if (item.match(/^[\t\n\f ]$/) || item == '/' || item == '>' || item == EOF) {
        return beforeAttributeValue;
    } else if (item == "\"") {
        return doubleQuoteAttributeValue;
    } else if (item == "\'") {
        return singleQuotedAttributeValue;
    } else if (item == ">") {

    } else {
        return UnquotedAttributeValue(item);
    }
}

function doubleQuoteAttributeValue(item) {
    if (item == "\"") {//Attribute中value的值已全部取到，将value赋给name
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (item == "\u0000") {

    } else if (item == EOF) {

    } else {
        currentAttribute.value += item;//不断完善value的值
        return doubleQuoteAttributeValue;
    }
}

function singleQuotedAttributeValue(item) {
    if (item == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (item == "\u0000") {

    } else if (item == EOF) {

    } else {
        currentAttribute.value += item;
        return singleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(item) {
    if (item.match(/^[\t\n\f ]$/)) {//等待下一个属性
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (item == "/") {//遇到自封闭标签时，不能直接emitcurrentToken
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selftClosingStartTag;
    } else if (item == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (item == "\u0000") {

    } else if (item == "\"" || item == "'" || item == "<" || item == "=" || item == "`") {

    } else if (item == EOF) {

    } else {
        currentAttribute.value += item;
        return UnquotedAttributeValue;
    }
}

function afterQuotedAttributeValue(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;//等待下一个属性
    } else if (item == "/") {
        return selftClosingStartTag;
    } else if (item == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;//此时attribute的name与value皆已获得，遇到>表示当前token告一段落，对当前token进行赋值
        emit(currentToken);
        return data;
    } else if (item == EOF) {

    } else {
        currentAttribute.value += item;
        return doubleQuoteAttributeValue;
    }
}

/**
 * 自封闭标签
 */
function selftClosingStartTag(item) {
    if (item == '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }
    else if (item == EOF) {

    } else {

    }
}

/**
 * 结束标签
 * @param {}} item 
 */
function endTagOpen(item) {
    if (item.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(item);
    } else if (item == '>') {

    } else if (item == EOF) {

    }
    else {

    }
}

// 第一部分：拆分文件
// 将parser单独拆到文件中，parser接受html文本作为参数 返回一颗DOM树
module.exports.parseHTML = function parseHTML(html) {
    // 第二部分：创建状态机
    let state = data;
    for (let item of html) {
        state = state(item);
    }
    state = state(EOF);//标识文件结尾
    return stack[0];
}