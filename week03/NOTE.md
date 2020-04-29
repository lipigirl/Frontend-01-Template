# 每周总结可以写在这里

Infinity= Number.POSITIVE_INFINITY 用于存放表示正无穷大的数值。(1/0;//Infinity)
Uint8Array 数组类型表示一个8位无符号整型数组，创建时内容被初始化为0。
Float64Array? 类型数组代表的是平台字节顺序为64位的浮点数型数组。
Encoding?
arguments?
IEEE 754 ?
Object.prototype? 属性表示 Object 的原型对象。

## Expression js表达式
* Grammer 
    * 运算符优先级 根据表达式生成树
        1+2*3 =>
            +
        1      *
            2    3

* MemberExpression=访问属性成员 
    * ECMA12.3章
    * a.b
    * a[b]
    * foo`string`
    * super.b构造函数
    * super['b']构造函数
    * new target 只能在函数里用
    * new Foo()

* NewExpression
    * new a()();
    * new new a();

* CallExpression=函数调用
    * foo()
    * super()
    * foo()['b']
    * foo().b
    * foo()`abx`

* Update Expression
    * a++
    * a--
    * --a
    * ++a

* Unary=单目运算符
    * delete a.b
    * void foo()=undefined
    * typeof a
    * +a
    * -a
    * ~a 按位取反
    * !a 
    * await a

* Exponental 指数
    ** 右结合

* Multipilicative 
    / % *

* Additive
    -+ 

* Shift 移位运算 左右移位
    <<>> >>>

* Relationship
    < > <= >= instanceof in

* Equality
    ==
    !=
    ===
    !==

* Bitwise 位运算
    & ^ |

* Logical 逻辑运算
    &&
    ||
    && || 不做类型转换

* Conditional 三目运算符
    ? :


* Completion Record
    * type:normal,break,continue,return or throw
    * value:types
    * target:label

* 简单语句
    * ExpressionStatement
        a=1+2;
    * EmptyStatement
        ; 
    * DebbugetStatement
        debugger;
    * throw 1; //test.html:4 Uncaught 1
    * continue labelName;
    * break labelName;//la

* 复杂语句
    * blockStatement
        {
            ....
        }
    * Iteration
        * while(){}
        * do{} while()
        * for(..;..;..){}
        * for(.. in Object){}
        * for(.. of Array){}
        * 循环、switch可以带标签
    
    作用域：源代码文本的范围 变量能作用的范围
    执行上下文executionContext：用户电脑上 js引擎中的内存

* 声明
    * VariableStatement

* 对象
    * 对象本质
        * 唯一性：唯一的标识 对象指针
        * 状态：描述对象 成员变量
        * 行为：状态的改变=行为 成员属性
    
    * 封装 继承 多态

    * Class类 描述对象的方式
        * 归类 C++
        * 分类
    * Prototype原型 不做严谨的分类，而是采用“相似”这样的方式描述对象
   
    * 设计对象的状态和行为时，遵循“行为改变状态”的原则。（面向对象实现与设计 书）

    * Object in JavaScript（运行时机制中看）
        * 原型
        * 属性（属性都属于运行时）（属性是key-value对）
            * key
                * Symbol
                * String
            * 数据型 Data （用来存储函数、描述状态）
                * value
                * writable
                * enumerable 是否可枚举
                * configurable writable、enumerable、configurable是否可以被改变（configurable一旦设为false，不能再设为true）
            * 访问器型 Accessor （描述行为）
                * get函数
                * set函数
                * enumerable
                * configurable
        * 当我们访问属性时，如果当前对象没有这个属性，则会沿着原型往上找，找到原型为null的对象，原型链由此而来。
    
    * Object API
        * Object.defineProperty 对象定义新属性或修改现有属性
            * 例子：let obj={};Object.defineProperty(obj,'name',{value:'pig',writable:false});
        * Object.create（创建一个新对象） / Object.setPropertyOf / Object.getPropertyOf
        * new / class / extends
        * new / function / property（废弃）
    * Function Object  
        * 行为Call=function 能call就是function
        * constructor 有constructor就是构造器
        * class用new function不用new