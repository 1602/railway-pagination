exports.init = function () {
    // add view helper
    railway.helpers.HelperSet.prototype.paginate = paginateHelper;
    // add orm method
    // sorry, jugglingdb only for now
    railway.orm.AbstractClass.paginate = paginateCollection;
};

// global view helper
function paginateHelper(collection) {
    if (!collection.totalPages || collection.totalPages < 2) return '';
    var page = parseInt(collection.currentPage, 10);
    var pages = collection.totalPages;
    var html = '<div class="pagination">';
    var prevClass = 'prev' + (page === 1 ? ' disabled': '');
    var nextClass = 'next' + (page === pages ? ' disabled': '');
    html += '<ul><li class="' + prevClass + '">';
    html += railway.helpers.link_to('&larr; Previous', '?page=' + (page - 1));
    html += '</li>';
    for (var i = 1; i <= pages; i++ ) {
        if (i == page) {
            html += '<li class="active"><a href="#">' + i + '</a></li>';
        } else {
            html += '<li>' + railway.helpers.link_to(i, '?page=' + i) + '</li>';
        }
    }
    html += '<li class="' + nextClass + '">';
    html += railway.helpers.link_to('Next &rarr;', '?page=' + (page + 1));
    html += '</li></ul></div>';
    return html;
};

// orm method
function paginateCollection(opts, callback) {
    var limit = opts.limit || 10;
    var page = opts.page || 1;
    var Model = this;

    Model.count(function (err, totalRecords) {
        Model.all({limit: limit, offset: (page - 1) * limit }, function (err, records) {
            if (err) return callback(err);
            records.totalRecords = totalRecords;
            records.currentPage = page;
            records.totalPages = Math.ceil(totalRecords / limit);
            callback(null, records);
        });
    });
}

