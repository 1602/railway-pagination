## About

Siple pagination plugin for RailwayJS MVC framework.

## Usage

1. turn on: **npmfile.js**

```javascript
    require('railway-pagination');
```

2. controller: **posts_controller.js**

```javascript
    action(function index() {
       var page = req.param('page') || 1;
       Post.paginate({limit: 10, page: page}, function (err, posts) {
           if (err) render({posts: posts});
       });
    });
```

3. view: **app/views/posts/index.ejs**

```javascript
    paginate(posts);
```

## License

MIT
