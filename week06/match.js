// 参考文章

/**
 * 
 * @param {*} pattern 
 * @param {*} string 
 */
function match(pattern, string) {
    let state = start;
    for (let item of string) {
        state = state(item);
    }
    return state == end;
}
match('ababx','i am ababx yeah');
match('groot', 'i am groot');