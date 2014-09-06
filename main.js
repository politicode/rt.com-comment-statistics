var authorAliases = [

]; //MUST BE SET WITH COMMENT SYSTEM NAME
var author = authorAliases[authorAliases.length - 1];

/*------------------------------------------------------------------------------------------------------*/
// PREPARE
/*------------------------------------------------------------------------------------------------------*/

var cackleSitePageId = cackle_widget[0].data.sitePageId;
var head = document.getElementsByTagName('head')[0];
var commentBtnPost = document.querySelector('.mc-button','.mc-comment-submit'),
    commentInput   = document.querySelector('.mc-editor-message').firstChild;

/*------------------------------------------------------------------------------------------------------*/
// BLACKLIST
/*------------------------------------------------------------------------------------------------------*/


var result = {user:{},keys:{}};
var blackListPostInterval = 1;

(function(blacklist){
    blacklist = blacklist.split(' ');
    var i = -1, l = blacklist.length;

    while(++i < l){
        result.keys[blacklist[i]] = {count:0,prevCount:0};
    }
})('jew nazi zion hitler fuck psychopath ebola shit stupid troll rude moan moron gay porky warmonger blitzkrieg fascist terrorist maniac');


/*------------------------------------------------------------------------------------------------------*/
// POST BLACKLIST COMMENT
/*------------------------------------------------------------------------------------------------------*/

function postBlacklist(){
    console.log('-----------------------------------');
    console.log('Evaluating Blacklist Results');
    console.log('-----------------------------------');
    var differ = false;
    var key;
    for(var k in result.keys){
        key = result.keys[k];
        console.log(k,key.count,key.prevCount);
        if(key.count != key.prevCount){
            differ = true;
            break;
        }
    }

    if(!differ){
        console.log('--> Results do not differ.');
        return;
    }
    console.log('--> Counting Results.');
    var keysResult =  '';
    for(var k in result.keys){
        if(result.keys[k].count == 0){
            continue;
        }
        keysResult += k + ' : ' + result.keys[k].count + '\n';
    }
    keysResult = keysResult +'\n';


    var str = keysResult + 'The statistician';
    console.log('***********************************');
    console.log(str);
    console.log('***********************************');

    setTimeout(function () {
        var str_ = str;
        commentInput.value = str_;
        setTimeout(function () {
            commentBtnPost.click();
        }, 1000);
        console.log('!!!PENG!!!');
    },500);

    console.log('--> Resetting Results');
    for(var k in result.keys){
        result.keys[k].prevCount = result.keys[k].count;
    }
}


/*------------------------------------------------------------------------------------------------------*/
// PULL COMMENTS
/*------------------------------------------------------------------------------------------------------*/

String.prototype.count = function(search) {
    var m = this.match(new RegExp(search.toString().replace(/(?=[.\\+*?[^\]$(){}\|])/g, "\\"), "g"));
    return m ? m.length:0;
};

var numComments = 1;
var interval = 3000;
var update;
var run = 0;

clearInterval(update);
update = setInterval(function(){
    var id = 'cackleInject';
    var script = document.getElementById(id);
    if(script){
        head.removeChild(script);
    }
    script = document.createElement('script');
    script.id = 'cackleInject';
    script.src = "http://a.cackle.me/widget/21638/comments?sitePage="+cackleSitePageId+"&order=desc&page=0&pagination=" + window.numComments +"&callback=cackleParseComments&_=1409993246386";
    head.appendChild(script);

    window.cackleParseComments = function(data){
        var page = data.page;

        if(page.totalPages == 1){
            console.log('--> Comments do not differ');
            return;
        }

        console.log('-----------------------------------');
        console.log(' Comments differ');
        console.log('-----------------------------------');
        console.log('--> old: ' + window.numComments + ', new: '+ page.totalElements);
        console.log('--> Evaluating keys occurrences');

        if(run > 0){

            var post;
            var postAuthorName;
            var postedByAuthorAlias;
            var i = -1, l = page.content.length;
            var k, m = authorAliases.length;
            var numOccurrences;
            for (var n in result.keys) {
                result.keys[n].count = 0;
            }
            while (++i < l) {
                post = page.content[i];
                postAuthorName = post.author.name;
                k = -1;
                while(++k < m){
                    if(postAuthorName == authorAliases[k]){
                        postedByAuthorAlias = true;
                        break;
                    }
                }
                if(postedByAuthorAlias){
                    continue;
                }

                for (var o in result.keys) {
                    numOccurrences = post.message.count(o);
                    if (numOccurrences > 0) {

                        console.log('--> Found occurrence of key: ' + o + '!!!');
                        console.log('   '+ post.message);
                        result.keys[o].count += numOccurrences;
                    }
                }
            }

            if (run % blackListPostInterval == 0) {
                postBlacklist();
            }
        }

        window.numComments = page.totalElements;
        run++;
    }

},interval);
