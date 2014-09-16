function Node(parent, nodeLexeme) {
    this.parent = parent;
    if (nodeLexeme != null)
        this.key = nodeLexeme.copy();
    else
        this.key = null;
    this.leftChild = null;
    this.rightChild = null;
    //высота поддерева с корнем в данной вершине
    this.height = 1;

    var temp = parent;
    var i = 1;
    while (temp != null) {
        i++;
        if (temp.height < i) {
            temp.height = i;
        }
        temp = temp.parent;
    }
}

//удаление текущего узла с сохранением левой ветки
Node.prototype.deleteNode = function() {
    if (this.parent == null) {
        this.leftChild.parent = null;
        tree = this.leftChild;
        currentNode = this.parent;
    } else {
        if (this.parent.leftChild == this)
            this.parent.leftChild = this.leftChild;
        else
            this.parent.rightChild = this.leftChild;
        this.leftChild.parent = this.parent;
        currentNode = this.parent;

        var temp = currentNode;
        while (temp != null) {
            if (temp.rightChild == null) {
                temp.height = temp.leftChild.height+1;
            } else {
                var max = temp.rightChild.height;
                if (temp.leftChild.height > temp.rightChild.height)
                    max = temp.leftChild.height;

                if (temp.height == max+1)
                    break;
                else
                    temp.height = max+1;
            }
            temp = temp.parent;
        }
    }
}

Node.prototype.drawSubtree = function(x, y, distance) {

    if (this.key.type == "func") {
        var funcTemp = d3.select("svg").append("use")
        .attr("xlink:href", "#func")
        .attr("y", y-heightElement)
        .attr("x", x-rFunc);

        var textLabel = this.key.str;
        d3.select("svg").append("text")
        .attr("y", y-heightElement+15)
        .attr("x", x-rFunc+11)
        .text(function(d){return textLabel;});

        distance = distance/2;
    } else if (this.key.type == "sign") {
        d3.select("svg").append("use")
        .attr("xlink:href", "#sign")
        .attr("y", y-heightElement)
        .attr("x", x-rSign);

        var textLabel = this.key.str;
        d3.select("svg").append("text")
        .attr("y", y-heightElement+15)
        .attr("x", x-rSign+5)
        .text(function(d){return textLabel;});

        distance = distance/2;
    } else if (this.key.type == "number") {
        d3.select("svg").append("use")
        .attr("xlink:href", "#number")
        .attr("y", y-heightElement)
        .attr("x", x-rNumber);

        var textLabel = this.key.str;
        d3.select("svg").append("text")
        .attr("y", y-heightElement+15)
        .attr("x", x-rNumber+3)
        .text(function(d){return textLabel;});

        distance = distance/2;
    }

    if (this.leftChild != null) {
        d3.select("svg").append("path")
        .attr("d","M"+x+" "+y+" L"+(x-distance)+" "+(y+dh-heightElement)+" Z")
        .attr("stroke", "black");
        this.leftChild.drawSubtree(x-distance, y+dh, distance);
    }

    if (this.rightChild != null) {
        d3.select("svg").append("path")
        .attr("d","M"+x+" "+y+" L"+(x+distance)+" "+(y+dh-heightElement)+" Z")
        .attr("stroke", "black");
        this.rightChild.drawSubtree(x+distance, y+dh, distance);
    }
}

var tree = new Node(null, null);
var currentNode = tree;
//константы, связанные с canvas svg
var width = 1000;
var height = 600;
var xBegin = 100;
var yBegin = 200;
var dh = 60;
var indexNode=1;
var heightElement = 20;
var rSign = 10;
var rFunc = 20;
var rNumber = 16;
//

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
            flagIsExpressionGood = false;
        getNextLexeme();

        parseE();

        if (currentLexeme.str != ')')
            flagIsExpressionGood = false;
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
            flagIsExpressionGood = false;
        getNextLexeme();
    } else {
        flagIsExpressionGood = false;
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

