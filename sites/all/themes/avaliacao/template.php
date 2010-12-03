<?php
// $Id

require_once("common_methods.php");

if (get_drupal_version() == 5) {
  require_once("drupal5_methods.php");
}
else {
  require_once("drupal6_methods.php");
}

/* Common methods */

function get_drupal_version() {	
	$tok = strtok(VERSION, '.');
	//return first part of version number
	return (int)$tok[0];
}

function get_page_language($language) {
  if (get_drupal_version() >= 6) return $language->language;
  return $language;
}

function get_full_path_to_theme()
{
  return base_path().path_to_theme();
}

function avaliacao_service_links_node_format($links) {
  return '<div class="service-links"><div class="service-label">'. t('Bookmark/Search this post with: ') .'</div>'. art_links_woker($links) .'</div>';
}

/**
 * Theme a form button.
 *
 * @ingroup themeable
 */
function avaliacao_button($element) {
  // Make sure not to overwrite classes.
  if (isset($element['#attributes']['class'])) {
    $element['#attributes']['class'] = 'Button form-'. $element['#button_type'] .' '. $element['#attributes']['class'];
  }
  else {
    $element['#attributes']['class'] = 'Button form-'. $element['#button_type'];
  }

  return '<button type="submit" '. (empty($element['#name']) ? '' : 'name="'. $element['#name']
         .'" ')  .'id="'. $element['#id'].'" value="'. check_plain($element['#value']) .'" '. drupal_attributes($element['#attributes']).'>'
         .'<span class="btn">'
         .'<span class="l"></span>'
         .'<span class="r"></span>'
         .'<span class="t">'.check_plain($element['#value']).'</span>'
         .'</span></button>';
}