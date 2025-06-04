"use strict";
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.ui.onmessage = (msg) => {
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
    } else if (msg.type === 'get-json-data') {
        console.log('get-json-data');
        const selectedNodes = figma.currentPage.selection;

        if (selectedNodes.length > 0) {
        // 使用官方API获取JSON
        const jsonData = figma.currentPage.selection.map(node => {
            //return node;
            const baseData = {
                id: node.id,
                //name: cleanName(node.name),
                name: node.name,
                type: node.type,
                visible: node.visible,
                locked: node.locked,
                x: Math.round(node.x),
                y: Math.round(node.y),
                width: Math.round(node.width),
                height: Math.round(node.height),
                style: {}
            };

            // // 提取子元素
            // if ('children' in node) {
            //     baseData.children = [];
            //     for (const child of node.children) {
            //     baseData.children.push(await extractDesignData(child));
            //     }
            // }

            return baseData;
        });
        
        console.log("选中的节点数据:", jsonData);
        const jsonString = JSON.stringify(jsonData);
        console.log(jsonString);
        figma.ui.postMessage({
            type: 'UPDATE_JSON',
            data: jsonString
        });
        
        // 如果你想复制到剪贴板
        // figma.ui.postMessage({
        //     type: 'COPY_JSON',
        //     data: JSON.stringify(jsonData, null, 2)
        // });
        } else {
            figma.notify("没有选中任何对象");
        }

    } else {
        figma.ui.postMessage({
            type: 'OPEN_URL',
            url: 'https://www.baidu.com/'
        });
        //figma.closePlugin();
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
