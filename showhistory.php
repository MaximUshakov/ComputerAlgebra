<?php
    echo "<head>";
    echo "<meta charset='utf-8'>";
    echo "<title>History</title>";
    echo "</head>";

    echo "<body>";
    echo "<h>История запросов.</h><pre><code>";
    echo "<p>При нажатиии на каждую из ссылок производится построение соответствующего дерева. <br>Также реализовано сохранение файла с историей в формате pdf и tex.<br>Tex-файл содержит в себе не только запросы, но и полученные деревья.</p>";
    echo "<input type='button' id='history' value='Скачать в LaTex'>";
    echo "<input type='button' id='historyPDF' value='Скачать в PDF'>";
    echo "<script>document.getElementById('history').onclick=function(){window.location.href='history.tex';}; document.getElementById('historyPDF').onclick=function(){window.location.href='createPDF.php';};</script>";
    echo "<ul>";

    $length = count(file("history.txt"));
    $file = fopen("history.txt", "r");
    for($i=0; $i < $length; $i++) {
        $str=fgets($file);
        $strlink = "<li><a href='createpage.php?request=".urlencode($str)."'>".$str."</a></li>";
        echo $strlink;
    }
    fclose($file);

    /*$file = fopen("history.txt", "r");

    while (!feof($file)) {
        $str=fgets($file);
        $strlink = "<li><a href='createpage.php?request=".$str."'>".$str."</a></li>";
        //$strlink = "<li><a href='createpage.php' onclick='$.post('createpage.php', {request:".$str."});'>".$str."</a></li>";
        echo $strlink;
    }*/

    //$res = file_get_contents("history.txt");
    //echo $res;

    echo "</ul>";
    echo "</code></pre></body>";
?>