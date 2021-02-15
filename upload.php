<?php

    $targetPath = "img/" . basename($_FILES["cover-image"]["name"]);
    move_uploaded_file($_FILES["cover-image"]["tmp_name"], $targetPath);
