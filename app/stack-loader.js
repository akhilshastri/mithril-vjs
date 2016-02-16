var StorageService = function (sid) {  /* Storage APi*/
    var STORAGE_ID = sid || 'SEARCH-LIST';
    return {
        get: function () {
            return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
        },
        put: function (itm) {
            localStorage.setItem(sid, JSON.stringify(itm));
        }
    }
};


var SearchListModel = function (data) {
    data = data || {};
    this.tag = m.prop(data.tag || "");
};

SearchListModel.list = function () {
    var dataService = StorageService('tags');
    return dataService.get();
};

SearchListModel.save = function (item) {
    var dataService = StorageService('tags');
    return dataService.put(item);
};


var SearchBox = {
    controller: function () {

    },
    view: function (ctrl, args) {
        return m('div', [
            m('input[placeholder="Search Text"]',
                {oninput: m.withAttr("value", args.searchText), value: args.searchText()}),
            m("button", {onclick: args.onSearchClick}, "Go")
        ])
    }

};
//changes 5
var HomePage = {
    controller: function (args) {
        var list = SearchListModel.list();
        return {
            searchText: m.prop(''),
            onunload: function () {
                console.log("unloading home component");
            },
            errorText: m.prop(''),
            save: function () {
                if (list.includes(this.searchText())) {
                    this.errorText("Already Exists");
                    return
                }
                this.errorText("");
                list.push(this.searchText());
                this.searchText('');
                SearchListModel.save(list);
            },
            list: function () {
                return list;
            },
            removeEl:function(){
                alert('removing el');
            }
        };
    },
    view: function (cntrl, args) {
        return m("div", "Home", [
            m(SearchBox, {onSearchClick: cntrl.save.bind(cntrl), searchText: cntrl.searchText}),
            m('ul',
                cntrl.list().map(function (searchText) {
                    return m('li', [
                        m('a[href="/list/' + searchText + '"]', {config: m.route}, searchText),
                        m('span',{onclick:cntrl.removeEl},'x')
                        ]);
                })
            ),
            m("div", cntrl.errorText()),
            m('a[href="/list"]', {config: m.route}, 'List')
        ])
    }
};


var ListPage = {
    controller: function () {
        var tag = m.route.param("tag") ;
        var qlist =  m.request({method: "GET", url: "api/" + tag +".json"});
        console.log(qlist);
        return {tag: tag,
                qList : m.request({method: "GET", url: "api/" + tag +".json"}),
                click:function(url){
                    window.open('http://stackoverflow.com/'+ url ,'_blank');
                }
            }
    },
    view: function (cntrl) {

        return m('div', "Showing for :" + cntrl.tag, [
            m('div', cntrl.qList().map(function(itm,i){
              return  m('div',[
                    m('span',(i+1) + '/' +itm.vote),
                    m('br'),
                    m('button',{onclick:cntrl.click(itm.link)},m('span',itm.question)) ,

                    m('br'),
                    m('span',itm.link),
                    m('hr')
                ]) ;
            })),
            m('a[href="/details"]', {config: m.route}, 'Details')
        ])
    }
};

var DetailsPage = {
    controller: function () {
        var url = m.route.param("url") ;
        return {url:url};
    },
    view: function (cntrl) {

        return m('div', "Details: " + cntrl.url  , [
            m('a[href="/home"]', {config: m.route}, 'Home'),
            m('iframe[src="http://stackoverflow.com/'+ cntrl.url +'"]')
        ])
    }
};

var dashboard = {
    controller: function () {
        return {id: m.route.param("userID")};
    },
    view: function (controller) {
        return m("div", controller.id);
    }
};


//setup routes to start w/ the `#` symbol
m.route.mode = "hash";


//define a route
m.route(document.body, "/home", {
    "/home": HomePage,
    "/list/:tag": ListPage,
    "/details/:url...": DetailsPage,
    "/dashboard/:userID": dashboard
});

