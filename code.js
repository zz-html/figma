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
// 检查对象类型
function checkIfComponent(node) {
    if (node.type === 'COMPONENT') {
        return `<div>${node.name} 是主组件</div>`;
    }
    else if (node.type === 'INSTANCE') {
        return `<div>${node.name} 是组件实例</div>`;
    }
    else {
        return `<div style="color: red;">${node.name} 不是组件或组件实例</div>`;
    }
}
function checkComponentDoc(node) {
    if (node.type === 'COMPONENT' || node.type === "INSTANCE") {
        // const instance = node as InstanceNode
        return `<div>开发文档:<a href="https://element.eleme.cn/#/zh-CN/component/button" target="_blank">Element</a>，<a href="http://10.51.134.51:30808" target="_blank">自定义</a></div>`;
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
    else if (msg.type === 'cancel') {
        figma.ui.postMessage({
            type: 'OPEN_URL',
            data: "https://element.eleme.cn/#/zh-CN/component/button"
        });
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
});
figma.on('selectionchange', () => {
    const selection = figma.currentPage.selection;
    if (selection.length == 0) {
        console.log('请先选中一个节点');
        figma.ui.postMessage({
            type: 'UPDATE_JSON',
            data: '请先选中一个节点'
        });
        return;
    }
    const selectedNode = selection[0];
    console.log("selectedNode", selectedNode);
    const resultComponent = checkIfComponent(selectedNode);
    const resultComponentChild = checkComponentChild(selectedNode);
    const resultComponentDoc = checkComponentDoc(selectedNode);
    // 检查是否有填充色（如矩形、文字等）
    let resultComponentColor = "";
    if ("fills" in selectedNode && selectedNode.fills !== figma.mixed) {
        const fills = selectedNode.fills;
        // 遍历所有填充（支持渐变、图片等，这里只处理纯色）
        fills.forEach((fill) => {
            var _a;
            if (fill.type === "SOLID") {
                const color = fill.color;
                const opacity = (_a = fill.opacity) !== null && _a !== void 0 ? _a : 1; // 透明度（默认 1）
                // 转换为 HEX 格式
                const hex = rgbToHex(color.r, color.g, color.b);
                console.log("HEX:", hex);
                console.log("RGBA:", `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity})`);
                resultComponentColor += `<div>颜色${hex},<span style="color:red">非规范标准色</span></div>`;
            }
        });
    }
    //字体
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
            console.log(`字体大小: ${textNode.fontSize}px (位于 ${textNode.name})`);
        }
    }
    figma.ui.postMessage({
        type: 'UPDATE_JSON',
        data: resultComponent + resultComponentColor + resultComponentDoc + resultComponentChild
    });
});
