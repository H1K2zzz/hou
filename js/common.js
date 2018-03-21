/*
	通过ID获取元素对象
*/
function $(id) {
	return document.getElementById(id);
}
/*
	缓冲运动
	obj：运动的对象
	target：运动属性和终点值的对象
	fn：回调函数
	ratio：运动系数，默认值为8
*/
function bufferMove(obj, target, fn, ratio = 8) {
	// 清除旧的定时器
	clearInterval(obj.timer);

	// 开启新的定时器
	obj.timer = setInterval(function () {
		var allOK = true;
		for(var attr in target) {
			// 获取当前值
			var cur = 0;
			if(attr === 'opacity') {
				cur = parseInt(getStyle(obj, 'opacity') * 100);
			} else {
				cur = parseInt(getStyle(obj, attr));
			}

			// 计算速度
			var speed = (target[attr] - cur) / ratio;

			// 判断方向
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

			// 计算下次的值
			var next = cur + speed;

			// 赋值
			if(attr === 'opacity') {
				obj.style.opacity = next / 100;
				obj.style.filter = 'alpha(opacity=' + next + ')';
			} else {
				obj.style[attr] = next + 'px';
			}

			// 判断当前属性是否运动完毕
			if(next !== target[attr]) {
				allOK = false;
			}
		}

		// 如果allOk为true，则说明所有的运动均已运动完毕
		if(allOK) {
			// 清除定时器
			clearInterval(obj.timer);
			// 执行回调函数
			if(fn) {
				fn();
			}
		}

	}, 50);
}

/*
	获取当前样式值
*/
function getStyle(obj, attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}