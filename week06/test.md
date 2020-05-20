基于 KMP 的 FSM 处理 pattern
  let textArray = [] // 未知字符串
  let text = ""
  let textLen = 0 // 未知字符串长度
  let patternArray = [] // pattern 字符串
  let pattern = ""
  let patternLen // 未知 pattern 长度
  let prefixArray = null // KMP prefix table
  let len = 0 // 最长公共前后缀长度


  function initState() {
    patternArray = pattern.split("")
    patternLen = patternArray.length
    textArray = text.split("")
    textLen = textArray.length
    prefixArray = new Array(patternLen)
    prefixArray[0] = 0
    let len = 0
    return patteranStart
  }


  function patteranStart(i) {
    if (patternArray[i] === patternArray[len]) {
      len++;
      prefixArray[i] = len;
      return { needAdd: true };
    } else {
      if (len > 0) {
        len = prefixArray[len - 1]
        return { needAdd: false }
      }
      else {
        prefixArray[i] = len
        return { needAdd: true }
      }
    }
    if (i ===  patternLen) {
      return movePrefixTable
    }
  }


  function movePrefixTable() {
    for (let i = patternLen - 1; i > 0; i--) {
      prefixArray[i] = prefixArray[i - 1]
    }
    prefixArray[0] = -1
    return KMPSearch
  }


  function KMPSearch(i, j) {
    if (j === patternLen - 1 && textArray[i] === patternArray[j]) {
      j = prefixArray[j]
      return { iNeedAdd: false, jNeedAdd: false, isMatched: true }
    }
    if (textArray[i] === patternArray[j]) {
      return { iNeedAdd: true, jNeedAdd: true, isMatched: false }
    } else {
      j = prefixArray[j]
      if (j === -1) {
        return { iNeedAdd: true, jNeedAdd: true, isMatched: false }
      }
    }
    return { iNeedAdd: true, jNeedAdd: false, isMatched: false }
  }
  
  const STATUS_MAP = {
    "init": initState,
    "prefixtable": patteranStart,
    "movePrefixTable": movePrefixTable,
    "KMPSearch": KMPSearch
  }

  function match(_text, _pattern) {
    text = _text
    pattern = _pattern

    let patternState = initState
    let STATUS_MAP_KEYS = Object.keys(STATUS_MAP)

    for (let status = 0; status < STATUS_MAP_KEYS.length; status++) {
      patternState = STATUS_MAP[STATUS_MAP_KEYS[status]]
      if (STATUS_MAP_KEYS[status] === "init") {

        patternState()

      } else if (STATUS_MAP_KEYS[status] === "prefixtable") {

        let res = { len: 0, needAdd: true }
        for (let i = 1; i <= patternLen; res.needAdd && i++) {
          res = patternState(i)
        }

      } else if (STATUS_MAP_KEYS[status] === "movePrefixTable") {

        patternState()

      } else if (STATUS_MAP_KEYS[status] === "KMPSearch") {

        let kmpSearchRes = { iNeedAdd: false, jNeedAdd: false, isMatched: false }
        for (let i = 0, j = 0; i < textLen;) {
          kmpSearchRes = patternState(i, j)
          if (kmpSearchRes.isMatched) {
            console.log("First Found pattern at ", i - j)
            return kmpSearchRes.isMatched
          }
          if (kmpSearchRes.iNeedAdd)
            i++
          if (kmpSearchRes.jNeedAdd)
            j++
        }
        return kmpSearchRes.isMatched

      }
    }
  }

  match("ABABABABCABAAB", "ABABCABAA")
运行结果
基于 KMP 的 FSM 处理 pattern 运行结果
parser.js.png