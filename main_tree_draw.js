function MainTreeDraw(inputText) {

        //обнуляем счётчики
        inputExpression = inputText+'$';

        index = 0;
        currentChar = '';
        flagIsExpressionGood = true;

        tree = new Node(null, null);
        currentNode = tree;

        texCommand = '';
        d3.select("svg").remove();
        //

        try {
            gc();
            getNextLexeme();
            parseE();

            if (currentLexeme.type != "end")
                throw new MyException("Miss sign", index-currentLexeme.str.length);
        } catch (ex) {

            texCommand = texCommand + "\\begin{picture}(800,50)";
            texCommand = texCommand + "\\put(20,30){"+ex.out()+"}";
            texCommand = texCommand + "\\end{picture}";

            d3.select("body").append("svg")
            .attr("width", 800)
            .attr("height", 50)
            .attr("viewBox", "0 0 800 50")

            d3.select("svg").append("text")
            .attr("y", 30)
            .attr("x", 20)
            .text(function(d){return ex.out();})

            flagIsExpressionGood = false;
        }

        if (flagIsExpressionGood)
            tree.DrawGraph();
}