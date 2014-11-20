<?php
    echo "<head>";
    echo "<meta charset='utf-8'>";

    echo "<script type='text/javascript' src='lexeme_analyzer.js'></script>";
    echo "<script type='text/javascript' src='exception.js'></script>";
    echo "<script type='text/javascript' src='parsing.js'></script>";
    echo "<script type='text/javascript' src='d3.min.js'></script>";
    echo "<script type='text/javascript' src='main_tree_draw.js'></script>";
    echo "<script type='text/javascript' src='graphDraw.js'></script>";
    echo "<link rel='stylesheet' type='text/css' href='graphStyle.css'/>";

    echo "<title>History</title>";
    echo "</head>";

    echo "<body>";
    echo "<h>История запросов.</h><pre><code>";

    $my_request = chop($_GET["request"], "\n");

    echo "Введённая строка:<br>";
    echo $my_request;

    echo "<br>Полученный граф:<br>";
    echo "<script type='text/javascript'> MainTreeDraw('".$my_request."'); </script>";

    echo "</code></pre></body>";

?>