erpApp.controller('vedorCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	
	$rootScope.$on("callPopulateVendorList", function() {
		$scope.populateVendorList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewVendor()
	});
	
	
	$scope.populateVendorList=function()
	{
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "vendor/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.isVendorInformation();
				$scope.vendorUsers = response.data;
				utils.hideProgressBar();
				console.log(response);

			}, function errorCallback(response) {
				/*$scope.showToast();
				$scope.message = "We are Sorry. Something went wrong. Please try again later."*/
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
				utils.hideProgressBar();

			});
	}
	
	$scope.isVendorPredent =false;
	$scope.isVendorInformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isVendorPredent =true;
			}
		else
			{
			$scope.isVendorPredent =false;
			}
			
	}
	
	$scope.vendorUser={};
	
	$scope.showAddNewVendor = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW VENDOR";
		$scope.vendorUser={};
		var addNewVendorDialog = {
			controller : 'DialogVendorController',
			templateUrl : 'views/vendorInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				vendorUser : $scope.vendorUser,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewVendorDialog)
		.then(function(answer) {},
				function() {});
	  };
	
	  
	  $scope.showEditVendor = function(ev , index) {
		  $scope.flag = 1;
		  $scope.vendorUser = $scope.vendorUsers[index];
		  $scope.information="EDIT VENDOR INFORMATION"
		    $mdDialog.show({
		      controller: 'DialogVendorController',
		      templateUrl: 'views/vendorInformation.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  vendorUser : $scope.vendorUser,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information
				}
		    })
		    .then(function(answer) {},
					function() {});
		  };
	  
	  $scope.deleteVendor = function(index) {
			console.log($scope.vendoUser);

			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "vendor/delete/" + + $scope.vendorUsers[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
				utils.hideProgressBar();
						$rootScope.$emit("callPopulateVendorList", {});
				console.log(data);

			}, function errorCallback(data) {
				console.log("Error");

			});
			utils.showProgressBar();
		};
		
		$scope.viewVendarInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.vendorUser = $scope.vendorUsers[index];
			$scope.isSaving = false;
			$scope.information="VIEW VENDOR INFORMATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'DialogVendorController',
						templateUrl : 'views/vendorInformation.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							  vendorUser : $scope.vendorUser,
							flag : $scope.flag,
							action : $scope.isReadOnly,
							information : $scope.information
						}
					})
					.then(function(answer) {},
							function() {});
		};
		$scope.showConfirm = function(ev,index) {
			var confirm = $mdDialog.confirm().title(
					'Are you sure you want to Delete Vendor Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'Delete' ).cancel('Cancel');

			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteVendor(index);
								/*
								$scope.message = 'Delete Vendor Record sucessfully';
								$scope.showToast();*/
								utils.showToast('Vendor Deleted Sucessfully!');
								
							},
							function() { });
		};
		
		/*function ProgressBarController($scope, $mdDialog) {
			
			$scope.hide = function() {
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};

			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};
		}*/
	
});
















