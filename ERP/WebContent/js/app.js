var erpApp = angular
		.module('ERPApp', [ 'ngRoute', 'ngMaterial', 'ngMessages', 'ngAnimate' ]);
erpApp.config(function($locationProvider) {
	$locationProvider.hashPrefix('');
});
erpApp.value('SERVER_URL', 'http://192.168.2.102:8086/ERP/');



erpApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'views/home.html',
		data : {
			loginRequired : true
		}
	}).when('/product', {
		templateUrl : 'views/product.html',
		data : {
			loginRequired : true
		}
	}).when('/userType', {
		templateUrl : 'views/userType.html',
		data : {
			loginRequired : true
		}
	}).when('/home', {
		templateUrl : 'views/home.html',
			data : {
				loginRequired : true
			}
	}).when('/login', {
		templateUrl : 'views/login.html'
	}).when('/unit', {
		templateUrl : 'views/unit.html',
		data : {
			loginRequired : true
		}
	}).when('/user', {
		templateUrl : 'views/user.html',
		data : {
			loginRequired : true,
		}
	
	}).when('/vendor', {
		templateUrl : 'views/vendor.html',
		data : {
			loginRequired : true
		}
	}).when('/rmInventary', {
		templateUrl : 'views/RMInventary.html',
		data : {
			loginRequired : true
		}
	}).when('/rawMaterial', {
		templateUrl : 'views/rawMaterial.html',
		data : {
			loginRequired : true
		}
	}).when('/rmVendorAssociation', {
		templateUrl : 'views/RMVendor.html',
		data : {
			loginRequired : true
		}
	}).when('/rmOrder', {
		templateUrl : 'views/RMOrder.html',
		data : {
			loginRequired : true
		}
	}).when('/userTypeAsso', {
		templateUrl : 'views/userPageTypeAsso.html',
		data : {
			loginRequired : true
		}
	}).when('/securityCheckOut', {
		templateUrl : 'views/SecurityCheckOut.html',
		data : {
			loginRequired : true
		}
	}).when('/client', {
		templateUrl : 'views/client.html',
		data : {
			loginRequired : true
		}
	}).when('/productOrder', {
		templateUrl : 'views/productOrder.html',
		data : {
			loginRequired : true
		}
	}).when('/productInventory', {
		templateUrl : 'views/productInventory.html',
		data : {
			loginRequired : true
		}
	}).when('/productRMAssociation', {
		templateUrl : 'views/productRMAssociation.html',
		data : {
			loginRequired : true
		}
	}).when('/order', {
		templateUrl : 'views/order.html',
		data : {
			loginRequired : true
		}
	}).when('/unAuthorized', {	
		templateUrl : 'views/unAuthorized.html',
		data : {
			loginRequired : true
		}
	}).when('/securityCheck', {
		templateUrl : 'views/securityInformation.html',
		data : {
			loginRequired : true
		}
	}).when('/qualityCheck', {
		templateUrl : 'views/qualityInspection.html',
		data : {
			loginRequired : true
		}
	}).when('/productionPlan', {
		templateUrl : 'views/productionPlan.html',
		data : {
			loginRequired : true
		}
	}).when('/productionPlan', {
		templateUrl : 'views/productionPlan.html',
		data : {
			loginRequired : true
		}
	}).when('/todaysProductionPlan', {
		templateUrl : 'views/todaysProductionPlan.html',
		data : {
			loginRequired : true
		}
	}).when('/status', {
		templateUrl : 'views/status.html',
		data : {
			loginRequired : true
		}
	}).when('/page', {
		templateUrl : 'views/page.html',
		data : {
			loginRequired : true
		}
	}).when('/productQualityCheck', {
		templateUrl : 'views/productQualityCheck.html',
		data : {
			loginRequired : true
		}
	}).when('/dispatchquantity', {
		templateUrl : 'views/dispatchQuantity.html',
		data : {
			loginRequired : true
		}
	}).when('/stores', {
		templateUrl : 'views/stroreInformation.html',
		data : {
			loginRequired : true
		}
	}).when('/productStore',{
		templateUrl : 'views/productStore.html',
		data :{
			loginRequired : true
		}
			
	}).when('/storeOut',{
		templateUrl : 'views/storeOut.html',
		data :{
			loginRequired : true
		}
			
	}).when('/fileUpload', {
		templateUrl : 'views/fileUpload.html',
		data : {
			loginRequired : true
		}
	}).when('/notFound', {
		templateUrl : 'views/notFound.html',
	}).otherwise({
		redirectTo : '/notFound'
	});
	
});
erpApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event,next) {

    	 if (next !== undefined) {
 	        if ('data' in next) {
 	            if ('loginRequired' in next.data ) {
 	                var loginRequired = next.data.loginRequired;
 	                /*console.log('loginRequired = ' + loginRequired);*/
 	                if(!Auth.isLoggedIn() && loginRequired){
 	                	$location.path('/login');
 	                 }/*else if(next.$$route.originalPath !=='/' && !Auth.isPageAccessible(next)){
 	                	 console.log('page is not accessible');
 	                	$location.path('/unAuthorized');
 	                 }*/else{
 	                	 //do nothing
 	                 }
 	            }
 	        }
 	    }
    });
}]);



erpApp.directive('uploadFiles', function () {  
    return {  
        scope: true,        //create a new scope  
        link: function (scope, el, attrs) {  
            el.bind('change', function (event) {  
                var files = event.target.files;  
                //iterate files since 'multiple' may be specified on the element  
                for (var i = 0; i < files.length; i++) {  
                    //emit event upward  
                    scope.$emit("seletedFile", { file: files[i] });  
                }  
            });  
        }  
    };  
});  


erpApp.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);

erpApp.directive('lettersOnly', function() {
	  return {
		    replace: true,
		    template: '<input replace="[^a-zA-Z]" with="">'
		  };
		});

erpApp.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });	

/*erpApp.controller('menuController', function($scope) {
	$scope.selectedIndex = 0;
	$scope.menuClicked=function($index)
	{
		 $scope.selectedIndex = $index;
		 console.log('selected index is' + $scope.selectedIndex);
	};
});*/		
erpApp.controller('finshedGoodctrl', function($scope) {

});

erpApp.controller('orderCtrl', function($scope) {

});

erpApp.controller('administrationCtrl', function($scope) {

});


erpApp.controller('notificationCtrl', function($scope) {

});

erpApp.controller('pageCtrl', function($scope) {

});
