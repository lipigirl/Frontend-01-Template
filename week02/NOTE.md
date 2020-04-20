# 编程语言通识
## 一、语言按语法分类
* 非形式语言
    中文、英文
* 形式语言 （乔姆斯基谱系）
    * 0型 无限制文法  
        ? ::= ? 
        例如：<a> <b> ::= "c"
    * 1型 上下文相关文法
        ?1 <A> ?2 ::= ?1 <B> ?2
        例如："a" <b> "c" ::= "a" "x" "c" //将x解释成了<b> 上下文不动，中间变
    * 2型 上下文无关文法
        <A> ::= ?
        等号左边只能有一个非终结符
        js大部分情况是上下文无关
    * 3型 正则文法
        只允许左递归 
        正确写法：<A> ::= <A> ?    
        ❌错误写法：<A> ::= ? <A> 


## 二、产生式 BNF（巴科斯范式）
* 组成
    * 用尖括号括起来的名称来表示语法结构名
    * 语法结构分为基础结构和需要其他语法结构定义的复合结构
        基础结构（终结符）一个Number或一个+-*/
        复合结构（非终结符）如乘法表达式=Number*Number、MulExpression、AddExpression <>中是非终结符
    * 引号和中间的字符表示终结符
    * 可以有括号
    * * 表示重复多次
    * | 表示或 表示其左右两侧任选一项
    * + 表示至少一次
    * ? 表示0次或1次

* 式子 
<expr> ::= <term>|<expr><addop><term>

* 练习：
    <digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

    <decimal> ::= "0" | (("1" ~ "9") <Number>*) //与十进制正则/0|[1-9][0-9]*/类似

    <addExpr> ::= <decimal> "+" <decimal> //普通加法 2+2

    <addExpr> ::= <addExpr> "+" <decimal> //连加 2+2+3

    * 加法表达式 
    <addExpr> ::= <decimal> | <addExpr> "+" <decimal> //2 +2 或 2+2 +3

    <multiExpr> ::= <decimal> "*" <decimal> //普通乘法

    <multiExpr> ::= <multiExpr> "*" <decimal> //连乘

    * 乘法表达式
    <multiExpr> ::= <decimal> | <multiExpr> "*" <decimal> 

    * 加法表达式
    <addExpr> ::= <multiExpr> | <addExpr> "+" <multiExpr> //由1 + 2 * 3可知加法表达式 也由乘法表达式组成

    * 支持除法的乘法表达式
    <multiExpr> ::= <decimal> | <multiExpr> "*" <decimal> | <multiExpr> "/" <decimal>

    * 支持减法的加法表达式
    <addExpr> ::= <multiExpr> | <addExpr> "+" <multiExpr> | <addExpr> "-" <multiExpr> 

    * 带括号的四则运算 34:45
    <logicalExpression> = <AddExpression> | 
        <logicalExpression> "||" <AddExpression> | 
        <logicalExpression> "&&" <AddExpression> //逻辑判断

    <primaryExpression> ::= <decimal> | "(" <logicalExpression> ")" //优先级

    <multiExpr> ::= <primaryExpression> | <primaryExpression> "*" <primaryExpression> | <multiExpr> "/" <primaryExpression>

    <addExpr> ::= <multiExpr> | <addExpr> "+" <multiExpr> | <addExpr> "-" <multiExpr> 

* Q:用正则表达式的方法做BNF

* 范例
    {
        get a {return 1},
        get:1
    } 
    //1型

    2**1**2 
    //2型 **表示右结合，因为正则只允许左递归，所以它是2型

* ECMA262:Grammer Summary


## 三、其他产生式 EBNF ABNF Custimized
AddExp:
    MultiExp
    AddExp ➕ MulExp
    AddExp ➖ MulExp
语法 单冒号
词法 双冒号

* Q:寻找计算机语言，尝试分类


## 四、图灵完备性
* 命令式——图灵机（可计算的）
    * 用goto实现 //goto无条件转移语句,可以让程序直接跳转到任意标记的位置
    * 用if和while实现 //C可以用white
* 声明式——lambda
    * 用递归实现


## 五、动态与静态
* 动态
    * 在用户的设备/在线服务器上运行
    * 产品实际运行时
    * Runtime
* 静态
    * 在程序员的设备上
    * 产品开发时
    * Compiletime


## 六、类型系统
* 按动静划分
    * 动态类型
    * 静态类型 TS

* 按是否隐式转换划分
    * 强类型 无隐式转换的类型
    * 弱类型 有隐式转换的类型 如JS TS

* 按复合类型划分
    * 结构体 如{a:T1,b:T2}
    * 函数签名 参数列表和返回值类型组成 如(T1,T2)=>T3 （90:00）

* 子类型 加入继承后
    * 逆变 能用Array<Parent>的地方，都能用Array<Child>，Array<Child>自然而然继承了Array<Parent>
    * 协变 能用Function<Child>的地方，都能用Function<Parent>，Function<Parent>自然而然继承了Function<Child>

* 括号：辅助运算符


## 七、一般命令式编程语言
* Atom 原子 变量名
    * Identifer 标识符
    * Literal
* Expression 表达式 由原子和操作符组成
    * Atom
    * Operator
    * Punctuator
* Statement 语句
    * Expression
    * Keyword
    * Punctuator
* Structure 结构
    * Function
    * Class
    * Process
    * Namespace
* Program 程序
    * Program ✔️
    * Module ✔️
    * Package
    * Library


## 语法-语义-运行时

## 答疑
    Q:2**2**3=256
    为什么不是4的三次方而是2的八次方，因为右结合运算2**(2**3)=2**8=256
    ====6:04=====


# JavaScript词法、类型
## Unicode 字符集 字符集合
* SourceCharacter
    * code point 码点
        * a-97
        * A-65

    * Unicode主要是与ascii兼容的是Basic Latin

    * Unicode
        * 网址 https://www.fileformat.info/info/unicode/index.htm
            * Blocks
                * Basic Latin 
                    * 0-128
                    * ascii字符的兼容部分 
                    * 包含了键盘上能打出的绝大部分字符（10:45）======12:14=======
            * Categories
        * 四个16进制位表示
    * cjk=chinese japan korea

## 词法Lexical Grammer
* InputElementDiv 
    * WhiteSpace 空白 space tab
        * <TAB> \t
            10  20
            9   8
        * <VT> \v
        * <FF> \f
        * <SP> \s 普通空格 32
        * <NBSP> NO-BREAK SPACE 160
        * <ZWNBSP> ZERO WIDTH NO-BREAK SPACE 零宽
            BOM
        * <USP> 不包含tab，包含space
    * LineTerminator 换行
        * LINE FEED <LF> 就是换行\n
        * CARRIAGE RETURN <CR> 就是回车\r 回车有结束符
        * <LS>
        * <PS>
    * Comment 注释
        * //
        * /* */
    * CommentToken 记号、词、令牌等一切有效的东西，无效的是👆上面三种
        * Punctuator 符号
        * IdentifierName
            * Identifier 标识符：变量名、属性
            * Keywords 关键字（有些keyword可以当变量名 如var undifend=123;）
            * Future reserved Keywords:enum
        * Literal 直接量
            * NumericLiteral
            * StringLiteral
        * Template

* Type
    * Number
        * IEEE754 Double Float
            Sign(1) 表示征服
            Exponent(11)
            Fraction(52) 分数
        * Grammer
            * DecimalLiteral 十进制
                * 0
                * 0.
                * .2
                * 1e3 e后面的数说明10的乘方数。
            * BinaryIntegerLiteral 二进制
                * 0b11 - 3 
            * OctallIntegerLiteral 八进制
                * 0o11 - 9
            * HexIntegerLiteral 十六进制
                * 0x256
        parseInt('100',2)  //4 二进制
        parseInt('100',8)  //8 八进制
        parseInt('100',10) //100 十进制
        小于精度 认为相等
        Math.abs(0.1+0.2-0.3)<Number.EPSILON 

    * String
        Charater
        Code Point
        Encoding
            ASCII (推荐)
            Unicode
            UCS U+0000 - U+FFFF JavaScript
            GB (兼容ASCII) 国标
                GB2312 
                GBK(GB13009) 
                GB18030
            ISO-8859 欧洲国家标准
            BIG5 繁体中文和ascii
            UTF UTF8（比特位做成了控制位） UTF16（适合存中文）
        Grammer
            "abc"
            'abc'
            `abc` template
        "\t" //"	"
        "\n" //line feed <LF>
        "\r" //carriage return <CR>
        "\\" // \
    * Boolean true|false
    * Null
    * Undefined
                    

不会被当成小数 97.是合法整数 97 .不是合法整数
97 .toString(2); //"1100001" a