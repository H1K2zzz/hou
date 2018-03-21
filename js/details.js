function $(id) {
	return document.getElementById(id);
}

var oBox  	   = $('box');
var oSmallBox  = $('small-box');
var aSmallImg  = Array.from(oSmallBox.children);
var oMiddleBox = $('middle-box');
var oMiddleImg = $('middle-img');
var oLargeBox  = $('large-box');
var oLargeImg  = $('large-img');
var oShadow    = $('shadow');


// 给缩略图添加鼠标进入事件
aSmallImg.forEach( v => {
	v.onmouseover = function () {
		// 先去掉所有的class名
		aSmallImg.forEach(v => v.className = '');

		// 当前img添加class
		this.className = 'active';

		// 改变中型图片的地址
		oMiddleImg.src = this.src;

		// 改变大型图片的地址
		oLargeImg.src = this.src;
	};
});

// 遮罩层最大的left和top值
var maxL = 0;
var maxT = 0;
// 大图片最大的left和top值
var maxLargeImgL  = 0;
var maxLargeImgT  = 0;

// 鼠标进入middle-box
oMiddleBox.onmouseover = function () {
	// 显示遮罩层
	oShadow.style.display = 'block';
	// 显示右侧的盒子
	oLargeBox.style.display = 'block';

	// 获取最大的left和top值
	maxL = oMiddleBox.offsetWidth - oShadow.offsetWidth;
	maxT = oMiddleBox.offsetHeight - oShadow.offsetHeight;

	maxLargeImgL = oLargeImg.offsetWidth - oLargeBox.offsetWidth;
	maxLargeImgT = oLargeImg.offsetHeight - oLargeBox.offsetHeight;
};

// 鼠标离开middle-box
oMiddleBox.onmouseout = function () {
	// 显示遮罩层
	oShadow.style.display = 'none';
	// 显示右侧的盒子
	oLargeBox.style.display = 'none';
};

// 给middle-box添加移动事件
oMiddleBox.onmousemove = function (ev) {
	var e = ev || window.event;
	var iL = e.clientX - oShadow.offsetWidth / 2 - oMiddleBox.offsetLeft - oBox.offsetLeft;
	var iT = e.clientY - oShadow.offsetHeight / 2 - oMiddleBox.offsetTop - oBox.offsetTop;


	// 限定左侧
	if(iL < 0) {
		iL = 0;
	}

	// 限定上侧
	if(iT < 0) {
		iT = 0;
	}

	// 限定右侧
	if(iL > maxL) {
		iL = maxL;
	}

	// 限定下侧
	if(iT > maxT) {
		iT = maxT;
	}
	oShadow.style.left = iL + 'px';
	oShadow.style.top  = iT + 'px';

	// 让大图移动
	oLargeImg.style.left  = - iL * maxLargeImgL / maxL + 'px';
	oLargeImg.style.top   = - iT * maxLargeImgT / maxT + 'px';
};
