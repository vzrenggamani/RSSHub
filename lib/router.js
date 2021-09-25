const Router = require('@koa/router');
const config = require('@/config').value;
const router = new Router();

// 遍历整个 routes 文件夹，导入模块路由 router.js 和 router-custom.js 文件
// 格式参考用例：routes/epicgames/router.js
const RouterPath = require('require-all')({
    dirname: __dirname + '/routes',
    filter: /^.*router([-_]custom[s]?)?\.js$/,
});

// 将收集到的自定义模块路由进行合并
for (const project in RouterPath) {
    for (const routerName in RouterPath[project]) {
        const proRouter = RouterPath[project][routerName]();
        proRouter.stack.forEach((nestedLayer) => {
            router.stack.push(nestedLayer);
        });
    }
}

// index
router.get('/', require('./routes/index'));

router.get('/robots.txt', async (ctx) => {
    if (config.disallowRobot) {
        ctx.set('Content-Type', 'text/plain');
        ctx.body = 'User-agent: *\nDisallow: /';
    } else {
        ctx.throw(404, 'Not Found');
    }
});

// WordPress
router.get('/blogs/wordpress/:domain/:https?', require('./routes/blogs/wordpress'));

// YouTube
router.get('/youtube/user/:username/:embed?', require('./routes/youtube/user'));
router.get('/youtube/channel/:id/:embed?', require('./routes/youtube/channel'));
router.get('/youtube/playlist/:id/:embed?', require('./routes/youtube/playlist'));

// Twitter
router.get('/twitter/user/:id/:routeParams?', require('./routes/twitter/user'));
router.get('/twitter/list/:id/:name/:routeParams?', require('./routes/twitter/list'));
router.get('/twitter/likes/:id/:routeParams?', require('./routes/twitter/likes'));
router.get('/twitter/followings/:id/:routeParams?', require('./routes/twitter/followings'));
router.get('/twitter/keyword/:keyword/:routeParams?', require('./routes/twitter/keyword'));
router.get('/twitter/trends/:woeid?', require('./routes/twitter/trends'));

// GitHub
router.get('/github/repos/:user', require('./routes/github/repos'));
router.get('/github/trending/:since/:language?', require('./routes/github/trending'));
router.get('/github/issue/:user/:repo/:state?/:labels?', require('./routes/github/issue'));
router.get('/github/pull/:user/:repo', require('./routes/github/pulls'));
router.get('/github/user/followers/:user', require('./routes/github/follower'));
router.get('/github/stars/:user/:repo', require('./routes/github/star'));
router.get('/github/search/:query/:sort?/:order?', require('./routes/github/search'));
router.get('/github/branches/:user/:repo', require('./routes/github/branches'));
router.get('/github/file/:user/:repo/:branch/:filepath+', require('./routes/github/file'));
router.get('/github/starred_repos/:user', require('./routes/github/starred_repos'));
router.get('/github/contributors/:user/:repo/:order?/:anon?', require('./routes/github/contributors'));
router.get('/github/topics/:name/:qs?', require('./routes/github/topic'));

// Instagram
router.get('/instagram/:category/:key', require('./routes/instagram/index'));

// test
router.get('/test/:id', require('./routes/test'));

// RSSHub
router.get('/rsshub/rss', require('./routes/rsshub/routes'));
router.get('/rsshub/routes', require('./routes/rsshub/routes'));
router.get('/rsshub/sponsors', require('./routes/rsshub/sponsors'));

module.exports = router;
