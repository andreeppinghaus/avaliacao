<div class="Post">
    <div class="Post-body">
<div class="Post-inner">
<div class="PostMetadataHeader">
<h2 class="PostHeaderIcon-wrapper"> <span class="PostHeader"><a href="<?php echo $node_url; ?>" title="<?php echo $title; ?>"><?php echo $title; ?></a></span>
</h2>

</div>
<div class="PostHeaderIcons metadata-icons">
<?php echo $date; ?> | <?php echo $name; ?>
</div>
<div class="PostContent">
<div class="article"><?php echo $content;?>
<?php if (isset($node->links['node_read_more'])) { echo '<div class="read_more">'.get_html_link_output($node->links['node_read_more']).'</div>'; }?></div>
</div>
<div class="cleared"></div>
<div class="PostFooterIcons metadata-icons">
<?php if (!empty($links)) { echo art_links_woker($node->links);} ?>
      <?php if (!empty($terms)) { echo art_terms_worker($node);} ?>

</div>

</div>

    </div>
</div>
