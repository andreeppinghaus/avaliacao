<?php

/* Drupal 6 methods definitons */

/**
 * Generate the HTML output for a single local task link.
 *
 * @ingroup themeable
 */
function mestrado_menu_local_task($link, $active = FALSE) {
  $output = preg_replace('~<a href="([^"]*)"[^>]*>([^<]*)</a>~',
  '<a href="$1" class="Button">'
  .'<span class="btn">'
  .'<span class="l"></span>'
  .'<span class="r"></span>'
  .'<span class="t">$2</span>'
  .'</span>'
  .'</a>', $link);
  return $output;
}

function mestrado_breadcrumb($breadcrumb) {
  return art_breadcrumb_woker($breadcrumb);
}

function mestrado_comment_wrapper($content, $type = null) {
  return art_comment_woker($content, $type = null);
}

function mestrado_menu_local_tasks() {
  return art_menu_local_tasks();
}