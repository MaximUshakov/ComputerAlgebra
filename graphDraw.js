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

//рисует стрелки от родителя к потомкам
Node.prototype.DrawArrows = function(canvas) {

    if (this.leftChild != null) {
        canvas.append("path")
        .attr("d","M"+this.x+" "+(this.y+heightElement/2)+" L"+this.leftChild.x+" "+(this.leftChild.y-heightElement/2)+" Z")
        .attr("stroke", "black");
    }

    if (this.rightChild != null) {
        canvas.append("path")
        .attr("d","M"+this.x+" "+(this.y+heightElement/2)+" L"+this.rightChild.x+" "+(this.rightChild.y-heightElement/2)+" Z")
        .attr("stroke", "black");
    }
}

Node.prototype.DrawNode = function(canvas) {

    if (this.key.type == "func") {
        canvas.append("ellipse")
        .attr("class", "func")
        .attr("cy", this.y)
        .attr("cx", this.x)
        .attr("ry", heightElement/2)
        .attr("rx", rFunc);

        var textLabel = this.key.str;
        canvas.append("text")
        .attr("y", this.y+2*heightElement/8)
        .attr("x", this.x-3*rFunc/8)
        .text(function(d){return textLabel;});

    } else if (this.key.type == "sign") {
        canvas.append("circle")
        .attr("class", "sign")
        .attr("cy", this.y)
        .attr("cx", this.x)
        .attr("r", heightElement/2);

        var textLabel = this.key.str;
        canvas.append("text")
        .attr("y", this.y+2*heightElement/8)
        .attr("x", this.x-heightElement/5)
        .text(function(d){return textLabel;});

    } else if (this.key.type == "number") {
        canvas.append("rect")
        .attr("class", "number")
        .attr("width", 2*rNumber)
        .attr("height", heightElement)
        .attr("y", this.y-heightElement/2)
        .attr("x", this.x-rNumber);

        var textLabel = this.key.str;
        canvas.append("text")
        .attr("y", this.y+3*heightElement/8)
        .attr("x", this.x-3*rNumber/4)
        .text(function(d){return textLabel;});
    }
}

Node.prototype.DrawSubtree = function(canvas) {

    this.DrawNode(canvas);

    this.DrawArrows(canvas);

    if (this.leftChild != null) {
        this.leftChild.DrawSubtree(canvas);
    }

    if (this.rightChild != null) {
        this.rightChild.DrawSubtree(canvas);
    }
}

Node.prototype.DrawGraph = function() {
    this.GetWidthNE();
    var widthSVG = this.leftWidth + this.rightWidth+2*xBegin;

    maxY = 0;
    this.SetCoordinatesNE(xBegin+this.leftWidth, yBegin);
    var heightSVG = maxY + 2*yBegin;

    canvas = d3.select("body").append("svg")
    .attr("width", widthSVG)
    .attr("height", heightSVG)
    .attr("viewBox", "0 0 "+widthSVG+" "+heightSVG);

    this.DrawSubtree(canvas);
}

//задаёт ширину подграфа и возвращает её
Node.prototype.GetWidth = function() {
    if (this.leftChild == null && this.rightChild == null) {
        this.width = 0;

        this.leftWidth = 0;
        this.rightWidth = 0;
    } else if (this.leftChild != null && this.rightChild != null) {
        var wL = this.leftChild.GetWidth();
        var wR = this.rightChild.GetWidth();

        if (wL > wR) {
            this.width = 2*wL+Dx;
        } else {
            this.width = 2*wR+Dx;
        }

        this.leftWidth = this.leftChild.leftWidth + this.width/4 + Dx/4;
        this.rightWidth = this.rightChild.rightWidth + this.width/4 + Dx/4;
    } else if (this.leftChild != null && this.rightChild == null) {
        this.width = this.leftChild.GetWidth();

        this.leftWidth = this.leftChild.leftWidth;
        this.rightWidth = this.leftChild.rightWidth;
    } else if (this.leftChild == null && this.rightChild != null) {
        this.width = this.rightChild.GetWidth();

        this.leftWidth = this.rightChild.leftWidth;
        this.rightWidth = this.rightChild.rightWidth;
    }

    return this.width;
}

//задаёт ширину подграфа и возвращает её (для случая неэквивалентных длин веток)
Node.prototype.GetWidthNE = function() {
    if (this.leftChild == null && this.rightChild == null) {
        this.width = 0;

        this.leftWidth = 0;
        this.rightWidth = 0;
    } else if (this.leftChild != null && this.rightChild != null) {
        var wL = this.leftChild.GetWidthNE();
        var wR = this.rightChild.GetWidthNE();

        if (wL > wR) {
            this.width = 2*wL+Dx;
        } else {
            this.width = 2*wR+Dx;
        }

        this.leftWidth = this.leftChild.leftWidth + this.leftChild.rightWidth + Dx/2;
        this.rightWidth = this.rightChild.leftWidth + this.rightChild.rightWidth + Dx/2;
    } else if (this.leftChild != null && this.rightChild == null) {
        this.width = this.leftChild.GetWidthNE();

        this.leftWidth = this.leftChild.leftWidth;
        this.rightWidth = this.leftChild.rightWidth;
    } else if (this.leftChild == null && this.rightChild != null) {
        this.width = this.rightChild.GetWidthNE();

        this.leftWidth = this.rightChild.leftWidth;
        this.rightWidth = this.rightChild.rightWidth;
    }

    return this.width;
}

//определение положения узлов графа (рекурсивно)
Node.prototype.SetCoordinates = function(currentX, currentY) {
    this.x = currentX;
    this.y = currentY;

    if (this.leftChild != null && this.rightChild != null) {
        this.leftChild.SetCoordinates(currentX - (this.width/4+Dx/4), currentY+Dy);
        this.rightChild.SetCoordinates(currentX + (this.width/4+Dx/4), currentY+Dy);
    } else if (this.leftChild != null && this.rightChild == null) {
        this.leftChild.SetCoordinates(currentX, currentY+Dy);
    } else if (this.leftChild == null && this.rightChild != null) {
        this.rightChild.SetCoordinates(currentX, currentY+Dy);
    } else if (this.leftChild == null && this.rightChild == null) {
        if (currentY > maxY)
            maxY = currentY;
    }
}

//определение положения узлов графа (рекурсивно) (для случая неэквивалентных длин веток)
Node.prototype.SetCoordinatesNE = function(currentX, currentY) {
    this.x = currentX;
    this.y = currentY;

    if (this.leftChild != null && this.rightChild != null) {
        this.leftChild.SetCoordinatesNE(currentX - (this.leftChild.rightWidth+Dx/2), currentY+Dy);
        this.rightChild.SetCoordinatesNE(currentX + (this.rightChild.leftWidth+Dx/2), currentY+Dy);
    } else if (this.leftChild != null && this.rightChild == null) {
        this.leftChild.SetCoordinatesNE(currentX, currentY+Dy);
    } else if (this.leftChild == null && this.rightChild != null) {
        this.rightChild.SetCoordinatesNE(currentX, currentY+Dy);
    } else if (this.leftChild == null && this.rightChild == null) {
        if (currentY > maxY)
            maxY = currentY;
    }
}
//константы, связанные с canvas svg
var xBegin = 50;
var yBegin = 30;
var Dy = 40;
var Dx = 60;
var maxY = 0;
var indexNode=1;
var heightElement = 20;
var rSign = 10;
var rFunc = 20;
var rNumber = 16;
//