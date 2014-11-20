<?php 
    require('fpdf.php'); 

    $finp = fopen('history.txt', 'r');
    $ft = fopen('time.txt', 'r');
    $fd = fopen('date.txt', 'r');

    //создание pdf файла
    $pdf = new FPDF();
    $pdf->AddPage();
    $pdf->SetFont('Courier','',16);
    $pdf->Cell(40, 5, 'History of requests:',0,1);

    $pdf->SetFont('Courier','',12);
    $length = count(file("history.txt"));
    for($i=0; $i < $length; $i++) {
            $str=chop(fgets($finp), "\n");
            $t=chop(fgets($ft), "\n");
            $d=chop(fgets($fd), "\n");
            
            $pdf->Cell(40, 5, ($i+1).'. message: text='.$str.', date='.$d.', time='.$t,0,1);
            if (fmod(($i+1), 50) == 0)
                $pdf->AddPage();
    }
    fclose($finp);
    fclose($ft);
    fclose($fd);

    $pdf->Output('history.pdf', 'I');
?>