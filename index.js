/** File Name: node_modules/railway-pagination/index.js
* Purpose: railway-pagination main file.
* Original author: Anatoliy C.
*
* Update History
* Name            Date       Description
* --------------- ---------- ------------------------------------------------------------------------------
* Jude L.         04/26/2012 - Updated the paginateCollection to allow the passing of order option to the Model.all routine.
* Jude L.         05/19/2012 - Updated the paginateCollection to allow the passing of where option to the Model.all routine
                              if one is provided.
**/

exports.init = function () {
    // add view helper
    railway.helpers.HelperSet.prototype.paginate = paginateHelper;
    // add orm method
    // sorry, jugglingdb only for now
    railway.orm.AbstractClass.paginate = paginateCollection;
};

// global view helper
function paginateHelper(collection,step) {
    if (!step) step = 5;
    if (!collection.totalPages || collection.totalPages < 2) return '';
    var page = parseInt(collection.currentPage, 10);
    var pages = collection.totalPages;
    var html = '<div class="pagination">';
    var prevClass = 'prev' + (page === 1 ? ' disabled': '');
    var nextClass = 'next' + (page === pages ? ' disabled': '');
    html += '<ul><li class="' + prevClass + '">';
    html += railway.helpers.link_to('&larr; First', '?page=1');
    html += railway.helpers.link_to('&larr; Previous', '?page=' + (page - 1));
    html += '</li>';

    var start = ( page <= step ) ? 1 : page-step;
    var end   = page+step;

    if ( page > pages-step )
    {
        start = pages-(step*2);
    }

    if ( end < (step*2) )
    {
        end = step*2;
    }

    if ( end > pages )
    {
        end = pages;
    }

    for (var i = start; i <= end; i++ ) {
        if (i == page) {
            html += '<li class="active"><a href="#">' + i + '</a></li>';
        } else {
            html += '<li>' + railway.helpers.link_to(i, '?page=' + i) + '</li>';
        }
    }
    html += '<li class="' + nextClass + '">';
    html += railway.helpers.link_to('Next &rarr;', '?page=' + (page + 1));
    html += railway.helpers.link_to('Last &rarr;', '?page=' + pages);
    html += '</li></ul></div>';
    return html;
};

// orm method
function paginateCollection(opts, callback) {
    var limit = opts.limit || 10;
    var page  = opts.page || 1;
    var order = opts.order||'1';
    var where = opts.where;
    var Model = this;

    Model.count(function (err, totalRecords) {
        if (where != null) {
            Model.all({limit: limit, offset: (page - 1) * limit, order: order, where: where }, function (err, records) {
                if (err) return callback(err);
                records.totalRecords = totalRecords;
                records.currentPage = page;
                records.totalPages = Math.ceil(totalRecords / limit);
                callback(null, records);
            });
        } else {
        Model.all({limit: limit, offset: (page - 1) * limit, order: order }, function (err, records) {
            if (err) return callback(err);
            records.totalRecords = totalRecords;
            records.currentPage = page;
            records.totalPages = Math.ceil(totalRecords / limit);
            callback(null, records);
        });
      }
    });
}
