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
// async function checkComponentMain(node: SceneNode): Promise<string> {
//   if (node.type === "INSTANCE") {
//     // 现在可以安全访问 mainComponent
//     console.log("INSTANCE:"); 
//     const mainComponent = await node.getMainComponentAsync();
//     console.log("主组件名称:", mainComponent?.name); // 使用可选链以防万一
//     return `<div">主组件名称:${mainComponent?.name}`;
//   } else {
//     console.log("选中的不是组件实例");
//     return '';
//   }
// }
// 检查对象子元素类型
function checkComponentChild(node) {
    if ('children' in node) {
        const children = node.children;
        let result = `${node.name} 包含${children.length}个子元素:`;
        children.forEach((child, index) => {
            // result += `<div>${index + 1}. ${child.name} (类型: ${child.type})</div>`;
            if (node.type === 'COMPONENT') {
                result += `<div>${index + 1}. ${child.name} 是组件</div>`;
            }
            else if (node.type === 'INSTANCE') {
                result += `<div>${index + 1}. ${child.name} 是组件实例</div>`;
            }
            else {
                result += `<div style="color: red;">${index + 1}. ${child.name} 不是组件或组件实例</div>`;
            }
        });
        return result;
    }
    else {
        return `${node.name} 不包含子元素`;
    }
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
    else if (msg.type === 'check-component') {
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
        const resultComponent = checkIfComponent(selectedNode);
        console.log(selectedNode, selectedNode.name);
        const resultComponentChild = checkComponentChild(selectedNode);
        figma.ui.postMessage({
            type: 'UPDATE_JSON',
            data: resultComponent + resultComponentChild
        });
        // const resultComponentMain = checkComponentMain(selectedNode);
        // console.log("resultComponentMain", resultComponentMain);
        // selectedNode.getMainComponentAsync().then(obj)
        // if (figma.currentPage.selection.length > 0) {
        //   const node = figma.currentPage.selection[0]; // 获取第一个选中的节点
        //   if (node.type === "INSTANCE") {
        //     // 现在可以安全访问 mainComponent
        //     console.log("INSTANCE:"); 
        //     const mainComponent = await node.getMainComponentAsync();
        //     console.log("主组件名称:", mainComponent?.name); // 使用可选链以防万一
        //   } else {
        //     console.log("选中的不是组件实例");
        //   }
        // }
    }
    else if (msg.type === 'cancel') {
        figma.ui.postMessage({
            type: 'OPEN_URL',
            data: "https://element.eleme.cn/#/zh-CN/component/button"
        });
        // https://element.eleme.cn/#/zh-CN/component/page-headers
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
});
