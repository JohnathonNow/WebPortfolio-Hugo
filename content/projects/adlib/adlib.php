<!DOCTYPE html>
<!-- adlib.php -->

<!-- Created 4/8/2016 -->

<!-- Author: John Westhoff (johnjwesthoff@gmail.com) -->

<!-- A simple web form for getting randomly filled madlibs -->

<?php
$ADJEFILE = '/home/john/wolfratbot/src/modules/adlib/adjectivelist.txt';
$NOUNFILE = '/home/john/wolfratbot/src/modules/adlib/nounlist.txt';
$VERBFILE = '/home/john/wolfratbot/src/modules/adlib/verblist.txt';
if (strlen($_POST['story']) > 0)
{
    $text = trim($_POST['story']);
    $text = nl2br($text);
   
    $f_adje = file($ADJEFILE); 
    $f_noun = file($NOUNFILE); 
    $f_verb = file($VERBFILE); 

    $repl = array(
        "{n}" => $f_noun,
        "{a}" => $f_adje,
        "{v}" => $f_verb
    );

    foreach ($repl as $key => $val)
    {
        while (($pos = strpos($text,$key)) !== false)
        {
            $word = "<u>" . trim($val[rand(0, count($val) - 1)]) . "</u>";
            $text = substr_replace($text, $word, $pos, strlen($key));
        }
    }
}
else
{
    $text = $_GET['stored_story'];
}
$surl = 'https://www.johnbot.me/post/adlib/?stored_story=' . urlencode($text);
 ?>
<html lang="en-us">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
  <title>(M)adlib Filler Outer &middot; Web Portfolio of John Westhoff</title>
  <link rel="stylesheet" href="https://www.johnbot.me//css/style.css" />
  <link rel="stylesheet" href="https://www.johnbot.me//css/font-awesome.min.css" />
  <link href='https://fonts.googleapis.com/css?family=Lato:100,300,400,600' rel='stylesheet' type='text/css'>
<style type="text/css">
.form-style-7{
    max-width:480px;
    margin:10px auto;
    background:#fff;
    border-radius:2px;
    padding:20px;
    font-family: Georgia, "Times New Roman";, Times, serif;
}
.form-style-7 h1{
    display: block;
    text-align: center;
    padding: 0;
    margin: 0px 0px 20px 0px;
    color: #5C5C5C;
    font-size:x-large;
}
.form-style-7 h2{
    display: block;
    text-align: center;
    padding: 0;
    border:1px solid #DDDDDD;
    margin: 0px 0px 20px 0px;
    color: #5C5C5C;
}
.form-style-7 ul{
    list-style:none;
    padding:0;
    margin:0;
}
.form-style-7 dl{
    display: block;
    padding: 2px;
    border:1px solid #DDDDDD;
    margin-bottom: 20px;
    border-radius: 3px;
    text-align: left;
}
.form-style-7 dd{
    display: block;
    padding: 2px;
    margin-bottom: 10px;
    border-radius: 3px;
    text-align: left;
}
.form-style-7 li{
    display: block;
    padding: 9px;
    border:1px solid #DDDDDD;
    margin-bottom: 2px;
    border-radius: 3px;
    resize: vertical;
}
.form-style-7 textarea{
    resize: vertical ;
    display: block;
    border:1px solid #DDDDDD;
    width: 100%;
    height: auto;
}
.form-style-7 li:last-child{
    border:none;
    margin-bottom: 0px;
    text-align: center;
}
.form-style-7 li; label{
    display: block;
    float: left;
    margin-top: -19px;
    background: #FFFFFF;
    height: 14px;
    padding: 2px 5px 2px 5px;
    color: #B9B9B9;
    font-size: 14px;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
}
.form-style-7 input[type='text'],
.form-style-7 input[type='date'],
</style>
</head>
<body>
<header class="header" style="background-color: #009DDC;
    background-image: url(https://www.johnbot.me//img/texture.png),linear-gradient(to bottom, #009DDC, #006ccb);background-repeat: repeat, no-repeat;background-position: left top, left top;background-size: 100px 100px, 100% 100%;" role="banner">

      <section id="branding">
        <div id="site-title"><a href="http://www.johnbot.me/">Web Portfolio of John Westhoff</a></div>
        <nav id="mainmenu">
          <ul>
            <li><a href="http://www.johnbot.me/">Articles</a></li>
            <li><a href="http://github.com/johnathonnow" target="_blank">Github</a></li>
            
            <li><a href="https://www.linkedin.com/in/johnjwesthoff" target="_blank">LinkedIn</a></li>
          </ul>
        </nav>
        <input type="checkbox" id="op"></input>
        <div class="lower">
          <label for="op">Menu</label>
        </div>
        <div class="overlay overlay-hugeinc">
          <label for="op"></label>
          <nav id="menu" role="navigation">
            <ul>
            <li><a href="http://www.johnbot.me/">Articles</a></li>
            <li><a href="http://github.com/johnathonnow" target="_blank">Github</a></li>
            
            <li><a href="https://www.linkedin.com/in/johnjwesthoff" target="_blank">LinkedIn</a></li>
          </ul>
          </nav>
        </div>
        <div class="clearfix"></div>
      </section>
      <div class="post-heading">
        <h1>
        (M)adlib Filler Outer
          <div class="share-icons-header">
            <a href="http://www.twitter.com/share?url=<?php echo rawurlencode($surl); ?>" target="_blank">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
            <g>
              <g>
                <path d="M437.219,245.162c0-3.088-0.056-6.148-0.195-9.18c13.214-9.848,24.675-22.171,33.744-36.275
                  c-12.129,5.453-25.148,9.097-38.835,10.626c13.965-8.596,24.675-22.338,29.738-38.834c-13.075,7.928-27.54,13.603-42.924,16.552
                  c-12.323-14.021-29.904-22.95-49.35-23.284c-37.332-0.612-67.598,30.934-67.598,70.463c0,5.619,0.584,11.072,1.752,16.329
                  c-56.22-3.616-106.042-32.881-139.369-77c-5.814,10.571-9.152,22.922-9.152,36.164c0,25.037,11.934,47.291,30.071,60.421
                  c-11.099-0.5-21.503-3.866-30.627-9.375c0,0.306,0,0.612,0,0.918c0,34.996,23.312,64.316,54.245,71.159
                  c-5.675,1.613-11.656,2.448-17.804,2.421c-4.367-0.028-8.596-0.501-12.713-1.392c8.596,28.681,33.577,49.628,63.147,50.323
                  c-23.145,19.194-52.298,30.655-83.955,30.572c-5.453,0-10.849-0.361-16.135-1.029c29.933,20.53,65.456,32.491,103.65,32.491
                  C369.23,447.261,437.219,339.048,437.219,245.162z"/>
                <path d="M612,306C612,137.004,474.995,0,306,0C137.004,0,0,137.004,0,306c0,168.995,137.004,306,306,306
                  C474.995,612,612,474.995,612,306z M27.818,306C27.818,152.36,152.36,27.818,306,27.818S584.182,152.36,584.182,306
                  S459.64,584.182,306,584.182S27.818,459.64,27.818,306z"/>
              </g>
            </svg></a>
            <a href="http://plus.google.com/share?url=<?php echo rawurlencode($surl); ?>" target="_blank">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
              <g>
                <g>
                  <path d="M349.146,402.251c0-30.016-17.387-44.815-36.525-60.922l-15.662-12.185c-4.785-3.895-11.294-9.124-11.294-18.693
                    c0-9.57,6.537-15.662,12.184-21.309c18.249-14.354,36.526-29.571,36.526-61.756c0-33.076-20.892-50.462-30.878-58.724l0,0h26.956
                    L358.271,153h-89.603c-23.479,0-53.049,3.478-77.863,23.924c-18.693,16.079-27.818,38.278-27.818,58.279
                    c0,33.911,26.093,68.294,72.188,68.294c4.368,0,9.125-0.445,13.937-0.863c-2.17,5.23-4.34,9.569-4.34,16.97
                    c0,13.464,6.955,21.753,13.047,29.57c-19.556,1.308-56.109,3.478-83.065,20.001c-25.676,15.217-33.493,37.416-33.493,53.077
                    c0,32.186,30.461,62.201,93.525,62.201C309.561,484.454,349.146,443.116,349.146,402.251z M255.621,291.34
                    c-37.415,0-54.384-48.292-54.384-77.418c0-11.322,2.17-23.034,9.569-32.186c6.955-8.707,19.139-14.382,30.461-14.382
                    c36.108,0,54.802,48.738,54.802,80.033c0,7.845-0.862,21.754-10.877,31.768C278.237,286.11,266.498,291.312,255.621,291.34z
                     M256.066,466.177c-46.54,0-76.556-22.171-76.556-53.049s27.846-41.311,37.416-44.787c18.276-6.093,41.755-6.982,45.677-6.982
                    c4.34,0,6.51,0,9.987,0.445c33.076,23.479,47.402,35.218,47.402,57.416C319.992,446.176,297.821,466.177,256.066,466.177z"/>
                  <polygon points="353.068,317.768 400.164,317.768 400.164,364.836 423.699,364.836 423.699,317.768 470.768,317.768 
                    470.768,294.233 423.699,294.233 423.699,247.165 400.164,247.165 400.164,294.233 353.068,294.233     "/>
                  <path d="M612,306C612,137.004,474.995,0,306,0C137.004,0,0,137.004,0,306c0,168.995,137.004,306,306,306
                    C474.995,612,612,474.995,612,306z M27.818,306C27.818,152.36,152.36,27.818,306,27.818S584.182,152.36,584.182,306
                    S459.64,584.182,306,584.182S27.818,459.64,27.818,306z"/>
                </g>
            </svg></a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo rawurlencode($surl); ?>" target="_blank">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
               viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
            <g>
              <g>
                <path d="M612,306C612,137.004,474.995,0,306,0C137.004,0,0,137.004,0,306c0,168.995,137.004,306,306,306
                  C474.995,612,612,474.995,612,306z M27.818,306C27.818,152.36,152.36,27.818,306,27.818S584.182,152.36,584.182,306
                  S459.64,584.182,306,584.182S27.818,459.64,27.818,306z"/>
                <path d="M317.739,482.617V306h58.279l9.208-58.529h-67.487v-29.348c0-15.272,5.007-29.849,26.928-29.849h43.813v-58.418h-62.201
                  c-52.298,0-66.569,34.438-66.569,82.175v35.413h-35.885V306h35.885v176.617H317.739L317.739,482.617z"/>
              </g>
            </svg>
            </a>
          </div>
          
        </h1>
      </div>

    </header>

    <div id="container">


<section id="content" role="main">
<section class="entry-meta">
  <span class="post-date">Apr 9, 2016</span>
</section></header>
<section class="entry-content">
<article>
<html>
<head>
</head>
<body>
<form class="form-style-7" method="post">
<?php
if ($text != '')
{
    echo '<h1>Generated Story</h1>';
    echo "<dl>$text</dl>";
}?>
<ul>
<li>
    <label for="story">My Story</label>
    <textarea rows="6" cols="20" name="story"><?php echo htmlspecialchars($_POST['story']); ?></textarea>
    <span>Enter your story here</span>
</li>
<dd>
    Use {n} for nouns<br>
    Use {v} for verbs<br>
    Use {a} for adjectives<br>
</dd>
<li>
    <button>Make Me a Story</button>
</li>
</ul>
<h2>
    <?php if ($text != '')
        echo "<a href=$surl>Link to Story</a>" ?>
</h2>
</form>
</body>
</html></p>

</section>
<div class="entry-links"></div>
</article>
<div class="share-icons-body">
  <a href="http://www.twitter.com/share?url=<?php echo rawurlencode($surl); ?>" target="_blank">
  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
  <g>
    <g>
      <path d="M437.219,245.162c0-3.088-0.056-6.148-0.195-9.18c13.214-9.848,24.675-22.171,33.744-36.275
        c-12.129,5.453-25.148,9.097-38.835,10.626c13.965-8.596,24.675-22.338,29.738-38.834c-13.075,7.928-27.54,13.603-42.924,16.552
        c-12.323-14.021-29.904-22.95-49.35-23.284c-37.332-0.612-67.598,30.934-67.598,70.463c0,5.619,0.584,11.072,1.752,16.329
        c-56.22-3.616-106.042-32.881-139.369-77c-5.814,10.571-9.152,22.922-9.152,36.164c0,25.037,11.934,47.291,30.071,60.421
        c-11.099-0.5-21.503-3.866-30.627-9.375c0,0.306,0,0.612,0,0.918c0,34.996,23.312,64.316,54.245,71.159
        c-5.675,1.613-11.656,2.448-17.804,2.421c-4.367-0.028-8.596-0.501-12.713-1.392c8.596,28.681,33.577,49.628,63.147,50.323
        c-23.145,19.194-52.298,30.655-83.955,30.572c-5.453,0-10.849-0.361-16.135-1.029c29.933,20.53,65.456,32.491,103.65,32.491
        C369.23,447.261,437.219,339.048,437.219,245.162z"/>
      <path d="M612,306C612,137.004,474.995,0,306,0C137.004,0,0,137.004,0,306c0,168.995,137.004,306,306,306
        C474.995,612,612,474.995,612,306z M27.818,306C27.818,152.36,152.36,27.818,306,27.818S584.182,152.36,584.182,306
        S459.64,584.182,306,584.182S27.818,459.64,27.818,306z"/>
    </g>
  </svg></a>
  <a href="http://plus.google.com/share?url=<?php echo rawurlencode($surl); ?>" target="_blank">
  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
    <g>
      <g>
        <path d="M349.146,402.251c0-30.016-17.387-44.815-36.525-60.922l-15.662-12.185c-4.785-3.895-11.294-9.124-11.294-18.693
          c0-9.57,6.537-15.662,12.184-21.309c18.249-14.354,36.526-29.571,36.526-61.756c0-33.076-20.892-50.462-30.878-58.724l0,0h26.956
          L358.271,153h-89.603c-23.479,0-53.049,3.478-77.863,23.924c-18.693,16.079-27.818,38.278-27.818,58.279
          c0,33.911,26.093,68.294,72.188,68.294c4.368,0,9.125-0.445,13.937-0.863c-2.17,5.23-4.34,9.569-4.34,16.97
          c0,13.464,6.955,21.753,13.047,29.57c-19.556,1.308-56.109,3.478-83.065,20.001c-25.676,15.217-33.493,37.416-33.493,53.077
          c0,32.186,30.461,62.201,93.525,62.201C309.561,484.454,349.146,443.116,349.146,402.251z M255.621,291.34
          c-37.415,0-54.384-48.292-54.384-77.418c0-11.322,2.17-23.034,9.569-32.186c6.955-8.707,19.139-14.382,30.461-14.382
          c36.108,0,54.802,48.738,54.802,80.033c0,7.845-0.862,21.754-10.877,31.768C278.237,286.11,266.498,291.312,255.621,291.34z
           M256.066,466.177c-46.54,0-76.556-22.171-76.556-53.049s27.846-41.311,37.416-44.787c18.276-6.093,41.755-6.982,45.677-6.982
          c4.34,0,6.51,0,9.987,0.445c33.076,23.479,47.402,35.218,47.402,57.416C319.992,446.176,297.821,466.177,256.066,466.177z"/>
        <polygon points="353.068,317.768 400.164,317.768 400.164,364.836 423.699,364.836 423.699,317.768 470.768,317.768 
          470.768,294.233 423.699,294.233 423.699,247.165 400.164,247.165 400.164,294.233 353.068,294.233     "/>
        <path d="M612,306C612,137.004,474.995,0,306,0C137.004,0,0,137.004,0,306c0,168.995,137.004,306,306,306
          C474.995,612,612,474.995,612,306z M27.818,306C27.818,152.36,152.36,27.818,306,27.818S584.182,152.36,584.182,306
          S459.64,584.182,306,584.182S27.818,459.64,27.818,306z"/>
      </g>
  </svg></a>
  <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo rawurlencode($surl); ?>" target="_blank">
  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
  <g>
    <g>
      <path d="M612,306C612,137.004,474.995,0,306,0C137.004,0,0,137.004,0,306c0,168.995,137.004,306,306,306
        C474.995,612,612,474.995,612,306z M27.818,306C27.818,152.36,152.36,27.818,306,27.818S584.182,152.36,584.182,306
        S459.64,584.182,306,584.182S27.818,459.64,27.818,306z"/>
      <path d="M317.739,482.617V306h58.279l9.208-58.529h-67.487v-29.348c0-15.272,5.007-29.849,26.928-29.849h43.813v-58.418h-62.201
        c-52.298,0-66.569,34.438-66.569,82.175v35.413h-35.885V306h35.885v176.617H317.739L317.739,482.617z"/>
    </g>
  </svg>
  </a>
</div>
<div class="clearfix"></div>
<figure class="author-bio">

<figcaption class="bio-text">I am currently a sophomore Computer Science student at the University of Notre Dame. I am interested in Robotics, and I help coach a local South Bend team. I am a member of the Notre Dame Linux Users Group. I enjoy working on side projects, some of which I intend to post here.</figcaption>
</figure>
<hr>

</section>
<div class="clear"></div>
</div>
<footer id="footer" style="color: #7A7B7C; background-color: #3A3B3C;background-image: url(http://www.johnbot.me//img/texture.png),linear-gradient(to bottom, #3A3B3C, #1d1e1e); background-repeat: repeat, no-repeat; background-position: left top, left top; background-size: 100px 100px, 100% 100%;">
  <div id="footer-container">
  
  
  
  <div class="clearfix"></div>
  </div>
  <div id="copyright"></div>
</footer>
<script src="http://www.johnbot.me//js/highlight.pack.js"></script>
  <script>
    hljs.initHighlightingOnLoad();
  </script>
  
</div>
</body>
    <link rel="shortcut icon" href="http://www.johnbot.me//img/favicon.ico" />
    <link rel="apple-touch-icon" href="http://www.johnbot.me//img/apple-touch-icon.jpg" />
</html>
