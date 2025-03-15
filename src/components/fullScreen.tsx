import { Expand, Shrink } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
const requestFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

// 用于退出全屏的函数，处理不同浏览器前缀
const exitFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
};

// 判断当前是否处于全屏状态，处理不同浏览器前缀
const isFullscreen = () => {
    return (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
};
export default function FullScreen() {
    const [isFull, setIsFull] = useState(false);

    const toggleFullscreen = () => {
        if (isFull) {
            exitFullscreen();
            setIsFull(false);
        } else {
            requestFullscreen(document.documentElement);
            setIsFull(true);
        }
    };
  return (
    
    <motion.div
    className="fixed top-2 right-2">
        {
            isFull?
            <Shrink
            onClick={toggleFullscreen}
            color="white"
          />
          :
          <Expand
          onClick={toggleFullscreen}
          color="white"
        />
        }
  
    </motion.div>
  );
}
