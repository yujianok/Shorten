var app = angular.module("app", ["ngResource", "ngRoute", "ngCookies"]);

app.factory("$pageContext", ["$cookies", function ($cookies) {
    return {currentUser: "test"};
    //return {currentUser: $cookies.currentUser};
}]);

app.factory("$restClient", ["$resource", function ($resource) {

    return {
    	httpClient: $resource("rest/:user/:type/:id", null, {
            "update": { method: "PUT" },
            "count": {method: "GET", params: {id: "count"}, transformResponse: function (data) {
                return {count: data};
            } }
        }),

    	get: function(user, type, id, success, error) {
    		this.httpClient.get({user: user, type: type, id: id}, success, error);
    	},

    	query: function(user, type, query, success, error) {
    		var param = {user: user, type: type};
    		for (var field in query) {
    	        if (query[field]) {
    	        	param[field] = query[field];
    	        }
    	    }


    		this.httpClient.query(param, success, error);
    	},

    	count: function(user, type, query, success, error) {
    		var param = angular.merge({user: user, type: type}, query);

    		this.httpClient.count(param, success, error);
    	},

    	update: function(user, type, id, entity, success, error) {
    		this.httpClient.update({user: user, type: type, id: id}, entity, success, error);
    	},

    	create: function(user, type, entity, success, error) {
    		this.httpClient.save({user: user, type: type}, entity, success, error);
    	},

    	delete: function(user, type, id, success, error) {
    		this.httpClient.remove({user: user, type: type, id: id}, success, error);
    	}

    };

}]);

app.controller("mainPanelController",
               ["$scope", "$restClient", "$pageContext",
                function ($scope, $restClient, $pageContext) {

    $scope.entity = {url: "basc"};
    $scope.generateShortUrl = function() {
        $restClient.create($pageContext.currentUser, "shorten_request", $scope.entity, function(data) {
            console.log(JSON.stringify(data));
            $scope.entity.url = "http://" + window.location.host + "/" + data.shortUri;
        });
    }
}]);

