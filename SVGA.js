/**
 *  ./svgaConfig
 *
 *  export const svga = {
 *    name:url
 *  }
 *
 */
import { svga } from './svgaConfig';

const SVGA = require('svgaplayerweb')

var svgaParser = new SVGA.Parser();

//加载过存下来
const svgaMap = new Map()

/**
 * 快速加载svga资源，但不装载
 * @param name 资源name
 */
export const loadSVGA = (name) => {
    if (!svgaMap[name]) {
        svgaMap[name] = new Promise((resolve, reject) => {
            svgaParser.load(svga[name], (videoItem) => {
                svgaMap[name] = videoItem
                resolve(videoItem)
            }, (err) => {
                reject(err)
            })
        })
    }
    return svgaMap[name]
}
/**
 * 快速装载一个svga动画
 * @param name 资源name
 * @param className 挂载元素的class name
 * @param frame 从第几帧开始。默认0帧
 * @param callback 回调
 * @param loops 播放次数。默认为空，循环播放。
 * @param clearsAfterStop 是否清空
 */
export const getSVGA = async (name, className, frame = 0, callback, play = true, loops, clearsAfterStop) => {
    const videoItem = await loadSVGA(name)
    var svga = new SVGA.Player(className);
    if (loops)
        svga.loops = loops;
    svga.clearsAfterStop = false
    if (clearsAfterStop)
        svga.clearsAfterStop = clearsAfterStop;
    svga.setVideoItem(videoItem);
    svga.stepToFrame(frame, play)
    svga.onFinished(() => {
        if (typeof callback == "function") {
            callback()
        }
    })
    return svga
}
