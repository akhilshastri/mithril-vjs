var StorageService = function (sid) {  /* Storage APi*/
    var STORAGE_ID = sid || 'SEARCH-LIST';
    return {
        get: function () {
            return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
        },
        put: function (itm) {
            localStorage.setItem(sid, JSON.stringify(STORAGE_ID));
        }
    }
}.call();


var SearchListModel = function (data) {
    data = data || {};
    this.tag = m.prop(data.tag || "");
};

SearchListModel.list=function(){
  var  dataService =StorageService('tags');
    return dataService.get();
} ;

SearchListModel.save=function(item){
  var  dataService =StorageService('tags');
    return dataService.put(item);
} ;


var SearchBox = {
    controller: function () {
    },
    view: function (cnt,args) {
        return m('div', [
            m('input[placeholder="Search Text"]'),
            m("button",{onlick:args.onsave}, "Go")
        ])
    }

};

var HomePage = {
    controller: function (args) {
        var cntrl = this;
        cntrl.list = SearchListModel.list();
        cntrl.save = function(list){
            debugger;
            alert('save clik');
           // SearchListModel.save(list);
        }  ;
        return {
            onunload: function () {
                console.log("unloading home component");
            }
        };
    },
    view: function (cntrl,args) {
        return m("div", "Home", [
            m(SearchBox, {onsave:cntrl.save}),
            m('a[href="/list"]', {config: m.route}, 'List')
        ])
    }
};


var ListPage = {
    controller: function () {

    },
    view: function () {

        return m('div', "List", [
            m('a[href="/details"]', {config: m.route}, 'Details')
        ])
    }
};

var DetailsPage = {
    controller: function () {

    },
    view: function () {

        return m('div', "Details", [
            m('a[href="/home"]', {config: m.route}, 'Home')
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
    "/list": ListPage,
    "/details": DetailsPage,
    "/dashboard/:userID": dashboard
});

