<?php

/**
 * @file
 * Mayo theme implementation to display the basic html structure of a single
 * Drupal page.
 *
 * Variables:
 * - $css: An array of CSS files for the current page.
 * - $language: (object) The language the site is being displayed in.
 *   $language->language contains its textual representation.
 *   $language->dir contains the language direction. It will either be 'ltr' or 'rtl'.
 * - $rdf_namespaces: All the RDF namespace prefixes used in the HTML document.
 * - $grddl_profile: A GRDDL profile allowing agents to extract the RDF data.
 * - $head_title: A modified version of the page title, for use in the TITLE
 *   tag.
 * - $head_title_array: (array) An associative array containing the string parts
 *   that were used to generate the $head_title variable, already prepared to be
 *   output as TITLE tag. The key/value pairs may contain one or more of the
 *   following, depending on conditions:
 *   - title: The title of the current page, if any.
 *   - name: The name of the site.
 *   - slogan: The slogan of the site, if any, and if there is no title.
 * - $head: Markup for the HEAD section (including meta tags, keyword tags, and
 *   so on).
 * - $styles: Style tags necessary to import all CSS files for the page.
 * - $scripts: Script tags necessary to load the JavaScript files and settings
 *   for the page.
 * - $page_top: Initial markup from any modules that have altered the
 *   page. This variable should always be output first, before all other dynamic
 *   content.
 * - $page: The rendered page content.
 * - $page_bottom: Final closing markup from any modules that have altered the
 *   page. This variable should always be output last, after all other dynamic
 *   content.
 * - $classes String of classes that can be used to style contextually through
 *   CSS.
 *
 * @see template_preprocess()
 * @see template_preprocess_html()
 * @see template_process()
 *
 * @ingroup themeable
 */
?>
<!DOCTYPE html>
<head>
  <title><?php print $head_title; ?></title>
  <link rel="stylesheet" href="/sites/all/libraries/slidenotes/slidenoteplayer.css">
  <link rel="stylesheet" href="/sites/all/libraries/slidenotes/drupal7/presentations.css">
  <link rel="stylesheet" href="/sites/all/libraries/slidenotes/themes/dialoger.css">
  <script src="/sites/all/libraries/slidenotes/drupal7/multiuserpresentation.js"></script>
  <script src="/sites/all/libraries/slidenotes/themes/dialoger.js"></script>
  <!--added css and js-bibs from script:-->
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
<!--<div id="slidenoteLoadingScreen"><h1>Please wait, loading missing libraries</h1><img src="/sites/all/libraries/slidenotes/images/wait-charlie-chaplin.gif"></div>-->
<div id="slidenoteloadingscreenwrapper">
        <div id="slidenoteeditorloadingscreen">
          <div id="slidenoteeditorloadingscreenbackground"></div>
          <div id="circle-colorful"></div>
          <div id="slidenoteeditorhidetexteditor"></div>
          <img id="loadingcircle" src="/sites/all/libraries/slidenotes/images/loadingscreen.gif">
          <div id="initialLoadingProgress"></div>
        </div>
</div>
  <?php print $page; ?>
</body>

</html>
