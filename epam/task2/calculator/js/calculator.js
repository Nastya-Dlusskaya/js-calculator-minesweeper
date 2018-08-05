let expression = '';
let isNotFirstOperator = false;
let numberCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 10, 101, 102, 103, 104, 105, 110];
let numOperatorCodes = [106, 107, 109, 111];
let numberShiftCodes = [56, 187];
let operatorCodes = [191, 189];
let shift = 16;

var equals = function () {
    $('.result').text(eval(expression) * 10 / 10);
};

var partEquals = function () {
    $('.result').text(eval(expression.slice(0,-1)) * 10 / 10);
};

var allClear = function () {
    clear();
    $('.result').text("");
    expression = '';

};

var clear = function () {
    $('.input').text("");
};

$(".btn-clr").on('click', clear);
$(".btn-aclr").on('click', allClear);

function numberFunction(value) {
    if (value && value !== '0') {
        expression += value;
        $('.input').text(expression);
    }
}

function operatorFunction(value) {
    if (expression.endsWith('+') || expression.endsWith('-') || expression.endsWith('*') || expression.endsWith('/')) {
        expression = expression.slice(-1) + value;
        $('.input').text(expression);
    } else if(expression && value==='-'){
        expression += value;
        $('.input').text(expression);
    } else if(isFinite(expression.slice(-1))){
        expression += value;
        $('.input').text(expression);
    }
    if(isNotFirstOperator){
        partEquals();
    }
    isNotFirstOperator = true;
}

document.addEventListener('keydown', function (e) {
    if (event.key === "Backspace" || event.key === "Delete") {
        clear();
    } else if (e.keyCode === 13) {
        equals();
    } else if(numberCodes.includes(e.keyCode)){
        numberFunction(String.fromCharCode(e.keyCode));
    }    else if(operatorCodes.includes(e.keyCode)){
        operatorFunction(String.fromCharCode(e.keyCode));
    }

});
