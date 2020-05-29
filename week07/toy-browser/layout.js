function getStyle(element) {
    if (!element.style) {
        element.style = {}
    }

    for (let prop in element.computedStyle) {
        // 将element中computedStyle的属性一一拷贝
        element.style[prop] = element.computedStyle[prop].value;
        //对宽高的value值做处理
        const value = element.computedStyle[prop].value;
        if (value.toString().match(/px$/)) {
            element.style[prop] = parseInt(value);
        }
        else if (value.toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(value);
        }
    }
    return element.style;
}

function layout(element) {
    if (!element.computedStyle) return;

    let style = getStyle(element);
    // 只处理flex排版
    if (style.display != 'flex') return;

    let items = element.children.filter(e => e.type == 'element');
    // items.sort((a, b) => {
    //     return (a.order || 0) - (b.order || 0);
    // });

    ["width", "height"].forEach(size => {
        if (style[size] === "auto" || style[size] === "") {
            style[size] = null;
        }
    });

    /**
     * ===============第一步：初始化================
     */

    // 定义主轴的方向（即项目的排列方向）
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = "row";
    }
    // 定义在一条轴线排不下时，如何换行
    if (!style.flexWrap || style.flexWrap == 'auto') {
        style.flexWrap = "nowrap";
    }
    // 定义项目在主轴上的对齐方式
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = "start";
    }
    // 定义项目在交叉轴上的对齐方式
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = "stretch";//占满整个交叉轴
    }
    // 定义多根交叉轴的对齐方式
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';//占满整个交叉轴
    }

    let mainStart,// 主轴起点 left / right / top / bottom
        mainEnd,// 主轴终点 left / right / top / bottom
        mainSize,// 主轴size width / height
        mainSign,// 主轴符号位，用于 是否 reverse +1 / -1
        mainBase,// 主轴开始的位置 0 / style.width
        crossStart,
        crossEnd,
        crossSize,
        crossSign,
        crossBase;
    switch (style.flexDirection) {
        case "row":
            mainSize = "width";
            mainStart = "left";
            mainEnd = "right";
            mainSign = +1;
            mainBase = 0;

            crossSize = "height";
            crossStart = "top";
            crossEnd = "bottom";
            break;
        case "row-reverse":
            mainSize = "width";
            mainStart = "right";
            mainEnd = "left";
            mainSign = -1;
            mainBase = style.width;

            crossSize = "height";
            crossStart = "top";
            crossEnd = "bottom";
            break;
        case "column":
            mainSize = "height";
            mainStart = "top";
            mainEnd = "bottom";
            mainSign = +1;
            mainBase = 0;

            crossStart = "left";
            crossEnd = "right";
            crossSize = "width";
            break;
        case "column-reverse":
            mainSize = "height";
            mainStart = "bottom";
            mainEnd = "top";
            mainSign = -1;
            mainBase = style.height;

            crossStart = "left";
            crossEnd = "right";
            crossSize = "width";
            break;
    }

    if (style.flexWrap === "wrap-reverse") {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossSign = 1;
        crossBase = 0;
    }

    /**
     * ===========第二步：收集元素进行============
     * 根据主轴尺寸,把元素分进行;
     * 若设置了no-wrap,则强行分配进第一行;
     */
    // 外层是否定宽
    let isAutoMainSize = false;
    if (!style[mainSize]) {
        // 若没有设置mainSize，直接撑开行
        style[mainSize] = 0;
        // 计算mainSize
        for (let i = 0; i < items.length; i++) {
            let itemStyle = getStyle(items[i]);
            if (itemStyle[mainSize] != null || itemStyle[mainSize] !== void (0)) {
                style[mainSize] = style[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }

    let flexLine = [];
    let flexLines = [flexLine];

    /**
     * 主轴剩余空间
     */
    let mainSpace = style[mainSize];// 初始时剩余空间等于主轴尺寸
    /**
     * 纵轴尺寸
     */
    var crossSpace = 0;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);
        // 若元素未设置mainSize，mainSize为0
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        // flex表示可伸缩，无论行内有多少元素都能放得下,此时mainSpace不作处理，后续自适应
        // flex: none | auto | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
        if (itemStyle.flex) {
            flexLine.push(item);
        }
        // 设置了no-wrap且isAutoMainSize=true,强行分配进第一行
        else if (style.flexWrap == 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            // if (itemStyle[crossSize] != null && itemStyle[crossSize] != (void 0)) {
            //     crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            // }
            flexLine.push(item);
        }
        else {
            // 若flex子项的mainSize 大于 flex容器的mainSize，flex子项的mainSize至少要缩到和行一样宽
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            // 主体逻辑 如果剩余空间放不下item
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;

                flexLine = [];//创建新的一行
                flexLines.push(flexLine);// 将新的一行塞入flexLines中
                flexLine.push(item);

                // 为新的一行重置mainSpace和crossSpace
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                // flex子项未超过flex容器剩余空间,添加进行
                flexLine.push(item);
            }
            // 处理交叉轴，取flex子项crossSize和crossSpace的最大值，作为crossSpace的值
            if (itemStyle[crossSize] != null && itemStyle[crossSize] != (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            // flex容器剩余 
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    /**
     *  =============第三步：计算主轴尺寸============(58:30)
     * 找出所有flex元素（flex元素可伸缩）;
     * 把主轴方向的剩余尺寸按比例分配给这些元素;
     * 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素。对负的 mainSpace， 所有该行 flex 子项等比例缩放（未设置 flex-shrink 默认值是1，也就是默认所有的 flex 子项都会收缩）
     */

    // 剩余空间为负数，所有flex元素为0，等比压缩剩余元素;
    if (mainSpace < 0) {
        // overflow,scale every item (happens only if container is single line) 单行才会出现mainSpace小于0的情况
        const scale = style[mainSize] / (style[mainSize] - mainSpace);// 目标值/实际值 此时mainSpace为负数
        // 循环计算子项位置
        let currentMainBase = mainBase;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMainBase;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];//Start+Size*Sign
            currentMainBase = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(items => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;

            // 找出所有flex元素
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);

                if (itemStyle.flex != null && item.flexWrap != (void 0)) {
                    flexTotal += itemStyle.flex;
                }
            }

            if (flexTotal > 0) {// 把主轴方向的剩余尺寸按比例分配给flex元素，其他元素按照自身size计算尺寸
                let currentMainBase = mainBase;

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;//计算比例
                    }
                    itemStyle[mainSatrt] = currentMainBase;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMainBase = itemStyle[mainEnd];
                }
            } else {//不存在flexable元素，把主轴方向的剩余尺寸按justifyContent分给这些元素
                let currentMainBase, gap;
                if (style.justifyContent == 'start') {
                    gap = 0;
                    currentMainBase = mainBase;
                } else if (style.justifyContent == 'end') {
                    gap = 0;
                    currentMainBase = mainBase + mainSign * mainSpace;
                } else if (style.justifyContent == 'center') {
                    gap = 0;
                    currentMainBase = mainBase + mainSign * mainSize / 2;
                } else if (style.justifyContent == 'space-between') {
                    gap = mainSpace / (items.length - 1) * mainSign;
                    currentMainBase = 0;
                }
                // space-around:第一个项目之前和最后一个项目之后的空白空间等于相邻项目之间的空间的一半。
                else if (style.justifyContent == 'space-around') {
                    gap = mainSpace / items.length * mainSign;
                    currentMainBase = mainBase + gap / 2;
                }
                else if (style.justifyContent === 'space-evenly') {
                    gap = mainSpace / (items.length + 1) * mainSign
                    currentMainBase = gap + mainBase
                }
                // 循环计算flex子项位置
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMainBase;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];//itemStyle[mainSize]可能为空，当为设置width时
                    currentMainBase = itemStyle[mainEnd] + gap;
                }
            }
        })
    }

    /**
     * =============第四步：计算交叉轴尺寸============(01:22:40)
     * 计算交叉轴方向，根据每行中最大元素尺寸计算行高
     * 根据每一行中最大元素尺寸计算行高
     * 根据行高flex-align和item-align确定元素具体位置
     */

    /**
     * 交叉轴剩余尺寸
     */
    var crossSpace;
    if (!style[crossSize]) {//未设定交叉轴size就计算出交叉轴size： crossSize未设定时，crossSize=所有行的crossSpace之和
        crossSpace = 0;
        style[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            style[crossSize] += flexLines[i].crossSpace;
        }
    } else {// 最终的crossSpace为 crossSpace减去每行最大crossSpace，即剩余空间，用作分配
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (style.flexWrap == 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;// 行高???

    let gap;// 间隔
    if (style.alignContent == 'start' || style.alignContent == 'flex-start') {
        gap = 0;
        crossBase = 0;
    } else if (style.alignContent == 'end' || style.alignContent == 'flex-end') {
        gap = 0;
        crossBase += crossSpace * crossSign;
    } else if (style.alignContent == 'center') {
        gap = 0;
        crossBase += crossSpace / 2 * crossSign;
    } else if (style.alignContent == 'space-between') {
        gap = crossSpace / (flexLines.length - 1);
        crossBase = 0;
    } else if (style.alignContent == 'space-around') {
        gap = crossSpace / flexLines.length;
        crossBase += gap / 2 * crossSign;
    } else if (style.alignContent == 'stretch') {
        gap = 0;
        crossBase = 0;
    }

    // 根据行高flex-align和item-align确定元素具体位置
    flexLines.forEach(items => {
        // 拉伸flex子项，填满交叉轴???
        let lineCrossSize = style.alignContent === 'stretch'
            ? items.crossSpace + crossSpace / flexLines.length
            : items.crossSpace;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || style.alignItems;// alignSelf控制flex子项

            if (itemStyle[crossSize] == null) {
                itemStyle[crossSize] = align == 'stretch' ? lineCrossSize : 0;
            }

            if (align == 'flex-start' || align == 'start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            else if (align == 'flex-end' || align == 'end') {
                itemStyle[crossEnd] = crossBase + lineCrossSize * crossSign;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }
            else if (align == 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            else if (align == 'stretch') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
                    itemStyle[crossSize] : lineCrossSize)

                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + gap);
    });

    console.log(items);
}

module.exports = layout;