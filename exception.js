function MyException(str, index) {
    this.str = str;
    //index - глобальная переменная файла lexeme_analyzer, в которой хранится индекс считываемого элемента
    this.index = index;
}

MyException.prototype.out = function () {
    return "Error: index "+this.index+", "+this.str;
}