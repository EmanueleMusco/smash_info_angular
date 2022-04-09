

angular.module("app").service("loginSvc", function ($http, $q) {
    this.login = function (user) {
        return $http.post("/Smash_Info/new/user", user)
            .then(function (response) {
                if (typeof response.data === "object") {
                    return response.data;
                } else {
                    return $q.reject(response.data);
                }
            }, function (response) {
                return $q.reject(response.data);
            });
    }
});

angular.module("app").service("authservice", function ($http, $q, $location) {
    this.auth = function () {
        var config = { withCredentials: true };
        return $http.get("/apiV2/Smash_Info/auth", config)
            .then(function (response) {
                if (response.status === 200) {
                } else {
                    return $q.reject(response.status)
                }
            }, function (response) {
                console.log(response)
                $location.path("benvenuto");
                return $q.reject(response.data);
            });
    }
});

angular.module("app").service("Get", function ($http, $q) {
    this.Ip = function () {
        return $http.get("https://api.myip.com/", {
        })
            .then(function (response) {
                if (response.data.error === null) {
                    return response.data;
                } else {
                    return $q.reject(response.data);
                }
            }, function (response) {
                return $q.reject(response.data);
            });
    }
});