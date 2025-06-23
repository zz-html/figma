"use strict";
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// 异步获取组件实例的母组件
function getParentComponent(instance) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mainComponent = yield instance.getMainComponentAsync();
            return mainComponent;
        }
        catch (error) {
            console.error('获取母组件失败:', error);
            return null;
        }
    });
}
// 检查对象类型
function checkIfComponent(node) {
    if (node.type === 'COMPONENT_SET') {
        return `<div>${node.name} 是主组件集</div>`;
    }
    else if (node.type === 'COMPONENT') {
        return `<div>${node.name} 是主组件</div>`;
    }
    else if (node.type === 'INSTANCE') {
        return `<div>${node.name} 是组件实例</div>`;
    }
    else {
        let parent = node.parent;
        console.log("parent", parent);
        while (parent) {
            if (parent.type === 'COMPONENT' || parent.type === 'INSTANCE') {
                return `<div>${node.name} 是组件内部元素</div>`;
            }
            parent = parent.parent;
        }
        return `<div style="color: red;">${node.name} 不是组件或组件实例</div>`;
    }
}
function checkComponentDoc(node) {
    console.log("checkComponentDoc", node.name);
    if (node.type === 'COMPONENT' || node.type === "INSTANCE" || node.name == "pagination" || node.name == "table" || node.name == "form") {
        // const instance = node as InstanceNode
        if (node.name == "颜色规范") {
            return `<div>开发文档:<a href="https://element-plus.org/zh-CN/component/color.html" target="_blank">Element</a>，<a href="http://10.51.134.51:30808/docs-components/css-color.html" target="_blank">颜色规范</a></div>`;
        }
        else if (node.name == "交换机") {
            return `<div>开发文档:<a href="https://icones.js.org/collection/ep" target="_blank">icones</a>，<a href="http://10.51.134.51:30808/docs-components/icon.html" target="_blank">图标规范</a></div>`;
        }
        else if (node.name == "button" || node.name == "按钮" || node.name.includes("朴素")) {
            return `<div>开发文档:<a href="https://element-plus.org/zh-CN/component/button.html" target="_blank">Element</a>，<a href="http://10.51.134.51:30808/docs-components/button.html" target="_blank">按钮规范</a></div>`;
        }
        else if (node.name == "form") {
            return `<div>开发文档:<a href="https://element-plus.org/zh-CN/component/form.html" target="_blank">Element</a>，<a href="http://10.51.134.51:30808/docs-components/form.html" target="_blank">表单规范</a></div>`;
        }
        else if (node.name == "table") {
            return `<div>开发文档:<a href="https://element-plus.org/zh-CN/component/table.html" target="_blank">Element</a>，<a href="http://10.51.134.51:30808/docs-components/table.html" target="_blank">表格规范</a></div>`;
        }
        else if (node.name == "pagination") {
            return `<div>开发文档:<a href="https://element-plus.org/zh-CN/component/pagination.html" target="_blank">Element</a>，<a href="http://10.51.134.51:30808/docs-components/pagination.html" target="_blank">分页规范</a></div>`;
        }
        else {
            return `<div>开发文档:<a href="https://element.eleme.cn/#/zh-CN/component/button" target="_blank">Element</a>，<a href="http://10.51.134.51:30808" target="_blank">自定义</a></div>`;
        }
    }
    return "";
}
// 检查对象子元素类型
function checkComponentChild(node) {
    if ('children' in node) {
        const children = node.children;
        let result = `${node.name} 包含${children.length}个子元素:`;
        children.forEach((child, index) => {
            // result += `<div>${index + 1}. ${child.name} (类型: ${child.type})</div>`;
            if (child.type === 'COMPONENT') {
                result += `<div>${index + 1}. ${child.name} 是组件</div>`;
            }
            else if (child.type === 'INSTANCE') {
                result += `<div>${index + 1}. ${child.name} 是组件实例</div>`;
            }
            else {
                result += `<div style="color: red;">${index + 1}. ${child.name} 不是组件或组件实例</div>`;
            }
        });
        return result;
    }
    else {
        //return `${node.name} 不包含子元素`
        return "";
    }
}
function rgbToHex(r, g, b) {
    const toHex = (n) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex; // 手动补零
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
function getAllVariableCollections() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 获取所有变量集合
            const collections = yield figma.variables.getLocalVariableCollectionsAsync();
            console.log('获取到的变量集合:', collections);
            // 获取所有变量
            const allVariables = yield figma.variables.getLocalVariablesAsync();
            console.log('获取到的变量:', allVariables);
            // collections.forEach(collection => {
            //   console.log('集合名称:', collection.name);
            //   console.log('集合ID:', collection.id);
            //   console.log('模式数量:', collection.modes.length);
            // });
            // return collections;
            const result = collections.map(collection => {
                // 找到属于这个集合的所有变量
                const collectionVariables = allVariables.filter(variable => variable.variableCollectionId === collection.id);
                return {
                    collectionId: collection.id,
                    collectionName: collection.name,
                    modes: collection.modes,
                    variables: collectionVariables.map(variable => ({
                        id: variable.id,
                        name: variable.name,
                        type: variable.resolvedType,
                        valuesByMode: variable.valuesByMode
                    }))
                };
            });
            console.log('完整的变量数据结构:', JSON.stringify(result));
            return result;
        }
        catch (error) {
            console.error('获取变量集合失败:', error);
            return [];
        }
    });
}
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-shapes') {
        console.log('create-shapes');
        // This plugin creates rectangles on the screen.
        const numberOfRectangles = msg.count;
        const nodes = [];
        for (let i = 0; i < numberOfRectangles; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
});
figma.on('selectionchange', () => {
    const selection = figma.currentPage.selection;
    if (selection.length == 0) {
        figma.ui.postMessage({
            type: 'UPDATE_JSON',
            data: '请先选中一个节点'
        });
        getAllVariableCollections();
        return;
    }
    const selectedNode = selection[0];
    console.log("selectedNode", selectedNode);
    const resultComponent = checkIfComponent(selectedNode);
    const resultComponentChild = checkComponentChild(selectedNode);
    const resultComponentDoc = checkComponentDoc(selectedNode);
    if (selectedNode.type === 'INSTANCE') {
        const mainComponent = getParentComponent(selectedNode);
        if (mainComponent) {
            mainComponent.then(node => {
                console.log('母组件详情zzz:', node === null || node === void 0 ? void 0 : node.name);
            });
        }
    }
    // 检查是否有填充色（如矩形、文字等）
    let resultComponentColor = "";
    if ("fills" in selectedNode && selectedNode.fills !== figma.mixed) {
        const fills = selectedNode.fills;
        // 遍历所有填充（支持渐变、图片等，这里只处理纯色）
        fills.forEach((fill) => {
            var _a;
            if (fill.type === "SOLID") {
                const color = fill.color;
                // const opacity = fill.opacity ?? 1; // 透明度（默认 1）
                // const rgba = `(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)},${opacity})`
                // 转换为 HEX 格式
                const hex = rgbToHex(color.r, color.g, color.b);
                if ((_a = fill.boundVariables) === null || _a === void 0 ? void 0 : _a.color) {
                    const variableId = fill.boundVariables.color.id;
                    const variableP = figma.variables.getVariableByIdAsync(variableId);
                    if (variableP) {
                        variableP.then(variable => {
                            console.log("使用了颜色变量", variable === null || variable === void 0 ? void 0 : variable.name);
                            let resultComponentVariableId = `颜色变量${variable === null || variable === void 0 ? void 0 : variable.name}`;
                            //resultComponentVariableId += `<div>颜色${hex},<span style="color:red">非规范标准色</span></div>`; 
                            figma.ui.postMessage({
                                type: 'APPEND_JSON',
                                data: resultComponentVariableId
                            });
                        });
                    }
                }
                resultComponentColor += `<div>颜色${hex},<span style="color:red">非规范标准色</span></div>`;
                resultComponentColor += `<div>颜色文档:<a href="http://10.51.134.51:30808/docs-components/css-color.html" target="_blank">自定义</a></div>`;
            }
        });
    }
    //字体
    let resultComponentFont = "";
    if (selectedNode.type === "TEXT") {
        const textNode = selectedNode;
        // 处理混合字体大小
        if (textNode.fontSize === figma.mixed) {
            const segments = textNode.getStyledTextSegments(["fontSize"]);
            segments.forEach(seg => {
                console.log(`字体大小: ${seg.fontSize}px (位于 ${textNode.name})`);
            });
        }
        else {
            resultComponentFont += `<div>字体大小:${textNode.fontSize}px,<span style="color:red">非规范标字体</span></div>`;
            resultComponentFont += `<div>字体文档:<a href="http://10.51.134.51:30808/docs-components/css-color.html" target="_blank">自定义</a></div>`;
        }
    }
    figma.ui.postMessage({
        type: 'UPDATE_JSON',
        data: resultComponent + resultComponentColor + resultComponentFont + resultComponentDoc + resultComponentChild
    });
});
