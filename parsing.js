var tree = new Node(null, null);
var currentNode = tree;

function parseE() {
    if (currentLexeme.str == '+' || currentLexeme.str == '-') {
        //add 3 tree' elements
        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;

        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;

        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;
        //
        var sign = currentLexeme.copy();
        getNextLexeme();

        parseU();
        //push sign
        currentNode.key = sign;
        currentNode = currentNode.parent;
        //
        parseA();
        parseB();
    } else {
        //add 2 tree' elements
        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;

        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;
        //
        parseU();
        parseA();
        parseB();
    }
}

function parseU() {
    if (currentLexeme.type == 'func') {
        //add 1 tree' element
        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;
        //
        var func = currentLexeme.copy();
        getNextLexeme();

        if (currentLexeme.str != '(')
            throw new MyException("Miss open bracket", index-currentLexeme.str.length);
        getNextLexeme();

        parseE();

        if (currentLexeme.str != ')')
            throw new MyException("Miss close bracket", index-currentLexeme.str.length);
        getNextLexeme();
        //push func
        currentNode.key = func;
        currentNode = currentNode.parent;
        //
    } else if (currentLexeme.type == 'number') {
        //push number
        currentNode.key = currentLexeme.copy();
        currentNode = currentNode.parent;
        //
        getNextLexeme();
    } else if (currentLexeme.str == '(') {
        getNextLexeme();
        parseE();

        if (currentLexeme.str != ')')
            throw new MyException("Miss close bracket", index-currentLexeme.str.length);
        getNextLexeme();
    } else {
        throw new MyException("Miss number/function/open bracket", index-currentLexeme.str.length);
    }
}

function parseA() {
    if (currentLexeme.type == 'sign' && (currentLexeme.str == '*' || currentLexeme.str == '/')) {
        //add 2 tree' elements with saving left child
        var left = currentNode.leftChild;

        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;

        currentNode.leftChild = left;
        left.parent = currentNode;
        currentNode.rightChild = new Node(currentNode, null);
        currentNode = currentNode.rightChild;
        //
        var sign = currentLexeme.copy();
        getNextLexeme();
        parseU();
        //push sign
        currentNode.key = sign;
        currentNode = currentNode.parent;
        //
        parseA();
    } else {
        currentNode.deleteNode();
    }
}

function parseB() {
    if (currentLexeme.type == 'sign' && (currentLexeme.str == '+' || currentLexeme.str == '-')) {
        //add 3 tree' elements with saving left child
        var left = currentNode.leftChild;

        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;

        currentNode.leftChild = left;
        left.parent = currentNode;
        currentNode.rightChild = new Node(currentNode, null);
        currentNode = currentNode.rightChild;

        currentNode.leftChild = new Node(currentNode, null);
        currentNode = currentNode.leftChild;
        //
        var sign = currentLexeme.copy();
        getNextLexeme();
        parseU();
        parseA();
        //push sign
        currentNode.key = sign;
        currentNode = currentNode.parent;
        //
        parseB();
    } else {
        currentNode.deleteNode();
    }
}

