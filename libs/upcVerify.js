module.exports = function(upc) {
	
	var digits = upc.split('');
	var step1 = 0;
	var len = digits.length;
	for (var i = 0; i < len; i = i + 2){
		step1 = step1 + parseInt(digits[i]);
	}
	var step2 = step1 * 3;
	var step3 = 0;
	for(var i = 1; i < len - 1; i = i + 2){
		step3 = step3 + parseInt(digits[i]);
	}
	var step4 = step2 + step3;
	var step5 = ((Math.floor(step4 / 10) + 1)*10) - step4;
	if (step5 === parseInt(digits[digits.length - 1])){
		return true;
	}else{
		return false;
	}
}
