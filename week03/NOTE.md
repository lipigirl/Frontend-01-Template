# 每周总结可以写在这里

Infinity?
Array(65)
精度问题 浮点丢失
arguments?
~a?

## Expression js表达式
* Grammer 运算符优先级 根据表达式生成树
    1+2*3
        +
    1      *
        2    3
* Expressions
    * Member运算符  访问属性成员 
        * ECMA12.3章
        * a.b
        * a[b]
        * foo`string`
        * super.b构造函数
        * super['b']构造函数
        * new target 只能在函数里用
        * 例子
            class Parent{
                constructor(){
                    this.a=1;
                }
            }
            class Child extends Parent{
                constructor(){
                super();
                this.b=2;
                }
            }
            new Child(); //Child {a: 1, b: 2}

            function f1(s){console.log('f1',s)}
            function f2(s){console.log('f2',s);return f1;}
            ===52fen=== 

    * New运算符
    * Call

* Reference
    * Object
    * Key

    * delete
    * assign
* Update Expression

* Unary
    * delete a.b
    * void fn()
        for(let i=0;i<10;i++){
            let button=document.createElement('button');
            document.body.appendChild(button);
            button.innerHTML=i;
            void function(i){
                button.onClick=function(){
                    console.log(i)
                }
            }(i)
        }
    * ~a
    * !a 
    * await a
&& || 不做类型转换
* Multipilicative * / %
js中的三目运算=短路运算
Number类型加法 String类型加法

String Number Boolean强制类型转换


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
        * for(.. in ..){}
        * for(.. of ..){}
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
        * 归类
        * 分类
    * Prototype原型 不做严谨的分类，而是采用“相似”这样的方式描述对象
   
    * 设计对象的状态和行为时，遵循“行为改变状态”的原则。（面向对象实现与设计 书）

    * Object in JavaScript
        * 原型
            * Symbol
            * String
        * 属性：属性都属于运行时
            * 数据型 Data 描述状态
                * Data Property
                    * value
                    * writable
                    * enumerable 是否可枚举
                    * configurable 是否可改变属性
            * 访问器型 Accessor 描述行为
                * Accessor Property
                    * get
                    * set
                    * enumerable
                    * configurable
    
    * Object API
        * {} Object.defineProperty
        * Object.create / Object.setPropertyOf / Object.getPropertyOf
        * new / class /extends
        * new / function /property
    * Function Object  
        * Call行为=function 能call就是function
        * constructor=构造器
        
        * class用new function不用new