let htmlWrapperStart = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0"/>
      <style type="text/css">
        abbr,address,article,aside,audio,b,blockquote,body,caption,cite,code,dd,del,dfn,dialog,div,dl,dt,em,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,input,ins,kbd,legend,li,mark,menu,nav,object,ol,p,pre,q,samp,section,select,small,span,strong,sub,sup,table,tbody,td,textarea label,tfoot,th,thead,time,tr,ul,var,video {
          margin: 0;
          padding: 0
        }
        body {
          font-size: 14px;
          line-height: 1.5;
          -webkit-text-size-adjust: none
        }
        table {
          border-collapse: collapse;
          border-spacing: 0
        }
        ol,ul {
          list-style: none
        }
        a {
          color: #428bca;
          text-decoration: none
        }
        a:focus {
          outline: 0
        }
        a:hover {
          color: #2a6496;
          text-decoration: underline
        }
        img {
          vertical-align: middle;
          border: 0;
          max-width: 100%;
        }
        pre {
          font-size: 1em;
          line-height: 1.5;
          padding: 10px;
          word-wrap: break-word;
          white-space: pre-wrap;
          background-color: #f5f5f5;
          border: 1px solid #ccc;
          border-radius: 3px;
        }
        table.t1 td,table.t1 th {
          padding: 5px 10px;
          border: 1px solid #ddd
        }
        table.t1 th {
          background: #f7f7f7;
          text-align: left
        }
      </style>
    </head>
    <body>`;
let htmlWrapperEnd = `
      <script>
        var links = document.getElementsByTagName('a');
        for (var k = 0, linksLen = links.length; k < linksLen; k++) {
          (function(k) {
            links[k].addEventListener("click", function(event) {
              event.preventDefault();
              window.postMessage(links[k].href);
            });
          })(k);
        }
      </script>
    </body>
  </html>`;

let other = [`
  <script>
    /* rn webview中注释格式要注意不然安卓下会出问题 */
    var i = 0, height, timer;
    var autoHeight = function(type) {
      if (height === document.body.offsetHeight && type === 0) {
        timer && clearInterval(timer);
        return;
      };
      height = document.body.offsetHeight;
      document.title = height;
      window.location.hash = ++i;
    };
    autoHeight(0);
    /* 
      刚开始进来的时候获取html的高度,貌似和rn加载webview或者webview渲染有关系,拿到的高度是ing的,
      所以轮询,直到不变位置,次数不会很多(2次左右),setTimeout可能会造成bug。
    */
    timer = setInterval(function() {
      autoHeight(0)
    }, 500);
    /* 图片加载 */
    var imgs = document.getElementsByTagName('img');
    for (var j = 0, imgsLen = imgs.length; j < imgsLen; j++) {
      imgs[j].addEventListener("load", function() {
        autoHeight(1);
      });
      imgs[j].addEventListener("error", function() {
        autoHeight(1);
      });
    }
  </script>
  `, `
  <style type="text/css">
    body {
      padding: 15px 10px;
    }
  </style>`];

export default function htmlHelper (html, type) {
  return htmlWrapperStart + html + other[type] + htmlWrapperEnd;
}