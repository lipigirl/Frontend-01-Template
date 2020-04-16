# 每周总结
前端技能模型
编程能力：解决难的问题
架构问题：解决大的问题 组件化
工程能力：解决人的问题 工具链
优秀工程师
领域知识+能力/潜力+成就+职业规划

PV UV IP
Page View 点击量
Unique View 独立访客
IP 独立IP数

日活/月活=用户粘性
日活：一天内某产品的用户数
月活：一月内某产品的用户数
工具链
工具链分类
init->run->test->publish（脚手架->本地调试->单元测试->发布）

工具链体系的设计
版本问题、数据统计
持续集成
持续集成->最终集成

客户端软件持续集成?
Daily Build
BVT（Build Verification Test）？
BVT只验证build构建的成功与失败，不深入测试构建好的build的功能、性能等。

前端持续集成?
Check-in build
Lint+Rule Check
技术架构
客户端架构：解决软件需求规模带来的复杂性
服务端架构：解决大量用户访问带来的复杂性
前端架构：解决大量页面需求带来的重复劳动问题 复用率

库：有复用价值的代码（URL正则、AJAX、ENV判断环境）
组件：UI上多次出现的元素（轮播、Tab）
模块：经常被使用的业务区块（登录）

组件的定义+基础设施=组件化方案

      GML
       |
      SGML
       |
HTML        XML
       |
      XHML       

GML是第一代置标语言，使文档能明确将标示和内容分开
SGML是在GML基础上进行调整，分为语法、DTD、Entity
HTML从SGML中提取，遵循DTD（html5不是基于SGML，所以不需要引用DTD），早期规范松散，比较易学
XML从SGML中提取，弥补了html不严谨的问题
XHTML使用XML的严格规格，弥补了html不严谨的问题，成为了html的代替者