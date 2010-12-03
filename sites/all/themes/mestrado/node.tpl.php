<div class="Post">
    <div class="Post-tl"></div>
    <div class="Post-tr"></div>
    <div class="Post-bl"></div>
    <div class="Post-br"></div>
    <div class="Post-tc"></div>
    <div class="Post-bc"></div>
    <div class="Post-cl"></div>
    <div class="Post-cr"></div>
    <div class="Post-cc"></div>
    <div class="Post-body">
<div class="Post-inner">
<div class="PostMetadataHeader">
<h2 class="PostHeaderIcon-wrapper"> <span class="PostHeader"><a href="<?php echo $node_url; ?>" title="<?php echo $title; ?>"><?php echo $title; ?></a></span>
</h2>
<div class="PostHeaderIcons metadata-icons">
<img class="metadata-icon" src="<?php echo get_full_path_to_theme(); ?>/images/PostDateIcon.png" width="17" height="18" alt="PostDateIcon"/> <?php echo $date; ?> | <img class="metadata-icon" src="<?php echo get_full_path_to_theme(); ?>/images/PostAuthorIcon.png" width="14" height="14" alt="PostAuthorIcon"/> <?php echo $name; ?>
</div>

</div>
<div class="PostContent">
<div class="article"><?php echo $content;?>
<?php if (isset($node->links['node_read_more'])) { echo '<div class="read_more">'.get_html_link_output($node->links['node_read_more']).'</div>'; }?></div>
</div>
<div class="cleared"></div>
<?php ob_start(); ?>
<div class="PostFooterIcons metadata-icons">
<?php if (!empty($links)) { echo art_links_woker($node->links);} ?>
      <?php if (!empty($terms)) { echo art_terms_worker($node);} ?>

</div>
<?php $metadataContent = ob_get_clean(); ?>
<?php if (trim($metadataContent) != ''): ?>
<div class="PostMetadataFooter">
<?php echo $metadataContent; ?>

</div>
<?php endif; ?>

</div>

    </div>
</div>
