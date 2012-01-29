## About

Siple pagination plugin for RailwayJS MVC framework.

## Usage

`npmfile.js`

    require('railway-pagination');

`posts_controller.js`

   action(function index() {
       var page = req.param('page') || 1;
       Post.paginate({limit: 10, page: page}, function (err, posts) {
           if (err) render({posts: posts});
       });
   });

`app/views/posts/index.ejs`:

   paginate(posts);

## License

MIT
