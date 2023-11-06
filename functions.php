<?php

add_action( 'wp_enqueue_scripts', 'oalachi_enqueue_assets' );
function oalachi_enqueue_assets() {
    wp_enqueue_script( 'main-theme', get_stylesheet_directory_uri().'/assets/js/main.min.js', [], false, true );
}