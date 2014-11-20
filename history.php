<?php
    //запись запроса в текстовый файл
    $f = fopen('history.txt', 'a');
    $ft = fopen('time.txt', 'a');
    $fd = fopen('date.txt', 'a');
    $my_request = $_POST["request"];
    $t=time();
    fwrite($f, $my_request."\n");
    fwrite($fd, date('Y-m-d', $t)."\n");
    fwrite($ft, date('h:i:s', $t)."\n");
    fclose($f);
    fclose($ft);
    fclose($fd);

    //записывание дерева в texTrees
    $ftree = fopen('texTrees.txt', 'a');
    fwrite($ftree, $_POST["tree"]."\n");
    fclose($ftree);

    //переписывание файла 'history.tex' информацией файла 'history.txt'
    $fout = fopen('history.tex', 'w');
    $finp = fopen('history.txt', 'r');
    $finpGraph = fopen('texTrees.txt', 'r');
    $ft = fopen('time.txt', 'r');
    $fd = fopen('date.txt', 'r');

    fwrite($fout, "\documentclass{report}\n\begin{document}\n{\Large History of requests:}\n\begin{quote}\n");
    
    $length = count(file("history.txt"));
    for($i=0; $i < $length; $i++) {
            $str=chop(fgets($finp), "\n");
            $t=chop(fgets($ft), "\n");
            $d=chop(fgets($fd), "\n");
            $g=chop(fgets($finpGraph), "\n");

            fwrite($fout, ($i+1).". message: text='$".$str."$', date='".$d."', time='".$t."'\n\n".$g."\n\n");
    }
    fwrite($fout, "\end{quote}\n\end{document}");

    fclose($fout);
    fclose($finp);
    fclose($finpGraph);
    fclose($ft);
    fclose($fd);

//    require('fpdf.php');
//        $fdata = file_get_contents('history.tex');
//        $pdf = new FPDF();
//        $pdf->AddPage();
//        $pdf->Cell(0,0,$fdata);
//        $pdf->Output();
        //exec('rm -rf tempBox');
      //echo exec("pdflatex history.tex",$t,$s);
      //echo $t;
      //echo $s;
      //exec('pdflatex history.tex');
        //exec('pdflatex history.tex');
?>
