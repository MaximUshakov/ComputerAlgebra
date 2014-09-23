var inputExpression = "";
var index = 0;
var currentChar = '';
var flagIsExpressionGood = true;

//type: func = {'sin', 'cos', 'tg', 'ctg'}, sign = {'+', '-', '*', '/'}, bracket = {'(', ')'}, end = {'$'}, number = {any float number, haven't name, but have value}
//пустой конструктор
function Lexeme() {
    this.type = "";
    this.str = "";
    this.value = 0;
}

//копирование для объектов
function copy() {
    var copyObject = new Lexeme();

    copyObject.type = this.type;
    copyObject.str = this.str;
    copyObject.value = this.value;

    return copyObject;
}

Lexeme.prototype.copy = copy;

Lexeme.prototype.out = function() {
    alert("type: "+this.type+",\nstr: "+this.str+",\nvalue: "+this.value);
}

var currentLexeme = new Lexeme();

function gc() {
    if (index < inputExpression.length) {
        currentChar = inputExpression[index];
        index ++;
    } else {
        throw new MyException("End of expression hasn't been found", inputExpression.length);
    }
}

function getNextLexeme() {
    var state = "Start";
    var currentString = "";

    while (true) {

        switch (state) {
            case "Start":
            if ( currentChar == ' ' ) {
                gc();
            } else if ( currentChar >= 'a' && currentChar <= 'z' ) {
                currentString += currentChar;
                gc();
                state = "Function";
            } else if ( currentChar == '+' || currentChar == '-' || currentChar == '*' || currentChar == '/' ) {
                currentString += currentChar;
                gc();

                currentLexeme.type = "sign";
                currentLexeme.str = currentString;
                currentLexeme.value = 0;
                return;
            } else if ( currentChar == '(' || currentChar == ')' ) {
                currentString += currentChar;
                gc();

                currentLexeme.type = "bracket";
                currentLexeme.str = currentString;
                currentLexeme.value = 0;
                return;
            } else if ( currentChar >= '0' && currentChar <= '9' ) {
                currentString += currentChar;
                gc();
                state = "NumberInt";
            } else if ( currentChar == '$' ) {
                currentString += currentChar;

                currentLexeme.type = "end";
                currentLexeme.str = currentString;
                currentLexeme.value = 0;

                if (index != inputExpression.length)
                    throw new MyException("Unavailable symbol", index);

                //поскольку после считывания символа конца строки считывание нового символа не происходит, то
                //чтобы сохранить структуру вс равно увеличиваем индекс на 1
                index++;
                return;
            } else {
                throw new MyException("Unavailable symbol", index);
            }
            break;

            case "Function":
            if ( currentChar >= 'a' && currentChar <= 'z' ) {
                currentString += currentChar;
                gc();
                state = "Function";
            } else {
                if ( currentString == "sin" || currentString == "cos" || currentString == "tg" || currentString == "ctg" ) {
                    currentLexeme.type = "func";
                    currentLexeme.str = currentString;
                    currentLexeme.value = 0;
                    return;
                } else {
                    throw new MyException("Unavailable function", index-currentString.length);
                }
            }
            break;

            case "NumberInt":
            if ( currentChar >= '0' && currentChar <= '9' ) {
                currentString += currentChar;
                gc();
                state = "NumberInt";
            } else if ( currentChar == '.' ) {
                currentString += currentChar;
                gc();
                state = "NumberFloat";
            } else {
                currentLexeme.type = "number";
                currentLexeme.str = currentString;
                currentLexeme.value = currentString - 0;
                return;
            }
            break;

            case "NumberFloat":
            if ( currentChar >= '0' && currentChar <= '9' ) {
                currentString += currentChar;
                gc();
                state = "NumberFloat";
            } else {
                currentLexeme.type = "number";
                currentLexeme.str = currentString;
                currentLexeme.value = currentString - 0;
                return;
            }
            break;

        }
    }

}