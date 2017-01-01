// !!! for in 循环和console.log都会在array的信息里面看到这些添加的方法

// js已有的方法
// 	 py		  js
// append -> push
// index -> index
//reverse ->reverse

Array.prototype.clear = function () {
	this.length = 0;
}

Array.prototype.copy = function () {
	var res = [];
	for (var i = 0; i < this.length; i++) {
		res.push(this[i]);
	}
	return res;
}

// s.insert(i, x), inserts x into s at the index given by i
Array.prototype.insert = function (i, x) {
	this[i] = x;
}

// s.pop([i]), retrieves the item at i and also removes it from s
Array.prototype.removeIndexOF = function (i) {
	for (; i < this.length; i++) {
		this[i] = this[i + 1];
	}
	this.length--;
}

// s.remove(x), remove the first item from s where s[i] == x
Array.prototype.removeItem = function (x) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == x)
			break;
	}
	for (; i < this.length; i++) {
		this[i] = this[i + 1];
	}
	this.length--;
}

// [1,2,3,4] + [5,6] = [1,2,3,4,5,6]
Array.prototype.addList = function (list) {
	var res = [];
	for (var i = 0; i < this.length; i++) {
		res.push(this[i]);
	}
	for (var i = 0; i < list.length; i++) {
		res.push(list[i]);
	}
	return res;
}

// array.count(x): the number of x in array
Array.prototype.count = function (x) {
	var res = 0;
	for (var i = 0; i < this.length; i++) {
		if (this[i] == x) {
			res++;
		}
	}
	return res;
}

// set
Array.prototype.unique = function () {
	var res = [];
	var json = {};
	for (var i = 0; i < this.length; i++) {
		if (!json[this[i]]) {
			res.push(this[i]);
			json[this[i]] = 1;
		}
	}
	return res;
}

// var arr = [112, 112, 34, '你好', 112, 112, 34, '你好', 'str', 'str1'];
// var arr2 = [222, 222];
// arr.push("12");
// console.log(arr.unique());
// console.log(arr.unique());
// console.log(arr.count(112));
// console.log(arr.addList(arr2).addList(arr2));
// arr.removeItem(34);
// alert(arr);
