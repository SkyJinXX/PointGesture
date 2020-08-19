# PointGesture: Windows 下的鼠标拖拽手势

## 目的

更**自然**的提高任务管理的效率。（适用于鼠标/Thinkpad小红点）

## 基础功能

-   按住鼠标右键，左右拖动来切换虚拟桌面(ctrl+win+←→)，上下拖动来开关任务试图(win+tab)。
-   快捷键暂停/激活(alt+shift+p)

## 优化功能

-   支持拖拽达到一定距离时自动触发，无需松手。
-   支持触发后，继续拖动，可触发在同轴反方向上的操作，无需松手。（参考了触控板的三指上下左右滑动，更加**自然灵活**）

## 还想做的功能

-   拖拽时，鼠标指针变为‘抓住的手’的形状，增加拖拽的**真实感**
-   检测是否有全屏应用，如果有，则自动关闭功能
-   可配置鼠标按键和具体操作

## Gif演示
![Gif演示](https://github.com/SkyJinXX/pointGesture/raw/master/assets/images/demo.gif)

## Install

[Download](https://github.com/SkyJinXX/pointGesture/releases) 

## Build

可能会遇到很多坑：需要手动修改iohook并rebuild、electron abi要和native dependencies的abi版本一致、cmake-js的安装、node-gyp的安装、electron-builder的一些坑

    npm run dist