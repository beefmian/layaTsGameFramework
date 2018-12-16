import AppL from "../AppL";
import Logger from "../utils/Logger";
import BaseClass from "../base/BaseClass";

/*
* Message基类
* jhj
* 2018-11-11
* QQ:8510001
*/
export default class MessageCenter extends BaseClass {
    public dict;

    public constructor() {
        super();
        this.dict = {};
    }

    /**
     * 清空处理
     */
    public clear() {
        this.dict = {};
    }

    /**
     * 添加消息监听
     * @param {string} cmd 消息唯一标识
     * @param {Function} listener 侦听函数
     * @param {any} listenerObj 侦听函数所属对象
     */
    public addListener(cmd, listener, listenerObj) {
        let arr = this.dict[cmd];
        if (!arr) {
            arr = [];
            this.dict[cmd] = arr;
        }

        //检测是否已经存在
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                Logger.trace("监听指令和函数都存在！");
                return;
            }
        }

        arr.push([listener, listenerObj]);
    }

    /**
     * 移除消息监听
     * @param {string} cmd 消息唯一标识
     * @param {Function} listener 侦听函数
     * @param {any} listenerObj 侦听函数所属对象
     */
    public removeListener(cmd, listener, listenerObj) {
        let arr = this.dict[cmd];
        if (!arr) {
            return;
        }

        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                arr.splice(i, 1);
                break;
            }
        }

        if (arr.length == 0) {
            this.dict[cmd] = null;
            delete this.dict[cmd];
        }
    }

    /**
     * 移除cmd消息所有监听
     * @param {string} cmd 消息唯一标识
     */
    public removeAllListener(cmd) {
        let arr = this.dict[cmd];
        if (!arr) {
            return;
        }
        this.dict[cmd] = null;
        delete this.dict[cmd];
    }

    /**
     * 触发消息
     * @param {string} cmd 消息唯一标识
     * @param {any} param 消息参数
     */
    public dispatch(cmd, param) {
        if (!this.dict[cmd]) { return; }

        let vo = new MessageVo();
        vo.cmd = cmd;
        vo.param = param;
        this.dealMsg(vo);
    }

    /**
     * 处理一条消息
     * @param {MessageVo} msgVo
     */
    public dealMsg(msgVo) {
        let cmd = msgVo.cmd;
        let param = AppL.CommonUtils.copy(msgVo.param);
        let listeners = this.dict[cmd];
        if (!listeners) { return; }

        for (let i = 0, len = listeners.length; i < len; i++) {
            let listener = listeners[i];
            listener[0].apply(listener[1], [param]);
        }
        msgVo.destroy();
    }

}

/**
 * 单条消息
 */
class MessageVo {
    private _cmd;
    private _param;

    public constructor() { }

    public destroy() {
        this._cmd = null;
        this._param = null;
    }

    public get cmd() {
        return this._cmd;
    }

    public set cmd(value) {
        this._cmd = value;
    }

    public get param() {
        return this._param;
    }

    public set param(value) {
        this._param = AppL.CommonUtils.copy(value);
    }

}