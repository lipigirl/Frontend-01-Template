# 编程语言通识

# 一、
非形式语言：中文、英文
形式语言： （乔姆斯基谱系）
    0型 无限制文法  
        ? ::= ? 
        例如：<a> <b> ::= "c"
    1型 上下文相关文法
        ?1 <A> ?2 ::= ?1 <B> ?2
    2型 上下文无关文法
        <A> ::= ?
    3型 正则文法 只允许左递归 
        正确写法：<A> ::= <A> ?    
        ❌错误写法：<A> ::= ? <A> 

# 二、产生式 BNF（巴科斯范式）
    <>
    语法结构
        基础结构（终结符）Number +-*/
        复合结构（非终结符）MulExpression AddExpression <>中是非终结符
    引号和中间的字符表示终结符
    可以有括号
    * 表示重复多次
    | 表示或 表示其左右两侧任选一项
    + 表示至少一次

<Number> = "0" | "1" | "2" | .... | "9"

<DecimalNumber> = "0" | (("1" | "2" | .... | "9") <Number>*)
=/0|[1-9][0-9]*/

<MulExpression> = <DecimalNumber> | <MulExpression> "*" <DecimalNumber>

<AddExpression> = <DecimalNumber> | <AddExpression> "+" <DecimalNumber>


<logicalExpression> = <AddExpression> | 
    <<AddExpression>> "||" <AddExpression> | 
    <<AddExpression>> "&&" <AddExpression>

Q:用正则表达式的方法做BNF

三、其他产生式 EBNF ABNF Custimized
AddExp:
    MultiExp
    AddExp ➕ MulExp
    AddExp ➖ MulExp
语法 单冒号
词法 双冒号

Q:寻找计算机语言，尝试分类

# 四、图灵完备性
命令式——图灵机（可计算的）
    goto 无条件转移语句,可以让程序直接跳转到任意标记的位置
    if和while
声明式——lambda
    递归

# 五、类型系统
静态类型 TS
动态类型

强类型 无隐式转换的类型
弱类型 有隐式转换的类型 如TS

复合结构
    结构体 如对象
    函数签名 如(T1,T2)=>T3

子类型
    逆变/协变
    能用Array<Parent>的地方，都能用Array<Child>
    能用Function<Child>的地方，都能用Function<Child>

括号：辅助运算符