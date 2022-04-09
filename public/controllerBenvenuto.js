angular.module('app').controller('controllerBenvenuto', function ($scope, $location,$cookies, loginSvc,Get) {

    $scope.new = {}

    let GetIp = function () {
        Get.Ip()
            .then(function (data) {
                $scope.ip = data.result
                console.log($scope.ip)
            })
    }

    $scope.new.ip = GetIp()

    $scope.send = function () {
        if ($scope.new.username != undefined && $scope.new.ip!=undefined) {

            loginSvc.login($scope.new)
                .then(function (data) {
                    if (data.code === 0 && data.error === null) {
                        token = data.result
                        $cookies.put("token", token, { samesite: "lax" });
                        $scope.risposta = "login avvenuto con sucesso"
                        $location.path("home");
                    } else if (data.code === -1 && data.result === "failed") {
                        $scope.risposta = data.error
                    }
                })
        }
    }
});