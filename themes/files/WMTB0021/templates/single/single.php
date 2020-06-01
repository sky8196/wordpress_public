<?php

$post = get_post();
// detail.json -> vars 数据获取
$theme_vars = json_config_array('detail', 'vars');
// Text 数据处理
$detail_title = ifEmptyText($theme_vars['title']['value'],'detail');
$detail_bg = ifEmptyText($theme_vars['bg']['value'], 'https://iph.href.lu/1600x500?text=1600x500');
$detail_desc = ifEmptyText($theme_vars['desc']['value']);


// SEO
$seo_title = ifEmptyText(get_post_meta(get_post()->ID,'seo_title',true),"$detail_title");
$seo_description = ifEmptyText(get_post_meta(get_post()->ID,'seo_description',true));
$seo_keywords = ifEmptyText(get_post_meta(get_post()->ID,'seo_keywords',true));

global $wp;
// 当前页面url
$page_url = get_lang_page_url();

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <!-- SEO -->
    <title><?php echo $seo_title; ?></title>
    <meta name="keywords" content="<?php echo $seo_description; ?>" />
    <meta name="description" content="<?php echo $seo_keywords; ?>" />
    <link rel="canonical" href="<?php echo $page_url;?>" />
    <!-- mobile responsive meta -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <?php get_template_part( 'templates/components/head' )?>

</head>

<body>
<!-- preloader start -->
<div class="preloader">
    <img src="<?php echo get_template_directory_uri()?>/assets/images/preloader.gif" alt="preloader">
</div>
<!-- preloader end -->

<!-- header -->
<?php get_header()?>
<!-- /header -->


<!-- page title -->
<section class="page-title-section overlay page-bg" data-background="<?php echo $detail_bg; ?>">
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <?php get_breadcrumbs();?>
                <p class="text-lighten"><?php echo $detail_desc; ?></p>
            </div>
        </div>
    </div>
</section>
<!-- /page title -->

<!-- blog details -->
<section class="section-sm bg-gray">
    <div class="container">
        <div class="row">
            <?php $post = get_post(); ?>

            <!-- blog contect -->
            <div class="col-12 mb-5">
                <h2><?php echo $post->post_title ?></h2>
                <div class="content">
                    <?php echo $post->post_content ?>
                </div>
            </div>
            <!-- comment box -->
            <div class="col-12">
                <?php get_template_part( 'templates/components/sendMessage' )?>
            </div>
        </div>
    </div>
</section>
<!-- /blog details -->

<!-- footer -->
<?php get_template_part( 'templates/components/footer' )?>

</body>
<?php get_footer() ?>
<!--微数据-->
<?php get_template_part( 'templates/components/microdata' )?>
</html>
