erpApp.controller('vedorCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	$scope.isVendorPredent =false;
	$scope.vendorUser={};
	
	$rootScope.$on("callPopulateVendorList", function() {
		$scope.populateVendorList();
	});
	
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewVendor()
	});
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$scope.populateVendorList=function(){
		 $scope.currentPage = 0;
	     $scope.pageSize = 10;
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "vendor/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data.data;
				$scope.isVendorInformation();
				$scope.vendorUsers = response.data;
				utils.hideProgressBar();
				console.log(response);
			}, function errorCallback(response) {
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
				utils.hideProgressBar();
			});
	}
	
	$scope.isVendorInformation = function() {
		$scope.isVendorPredent = $scope.data.length === 0 ? true : false;
	};

	$scope.showAddNewVendor = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW VENDOR";
		$scope.vendorUsers={};
		var addNewVendorDialog = {
			controller : 'DialogVendorController',
			templateUrl : 'views/vendorDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				vendorUsers : $scope.vendorUsers,
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
	
	  $scope.showEditVendor = function(ev , $index) {
		  $scope.flag = 1;
		  $scope.vendorUsers = $scope.vendorUsers[($scope.currentPage*$scope.pageSize) + ($index)];
		  $scope.information="EDIT VENDOR INFORMATION"
		    $mdDialog.show({
		      controller: 'DialogVendorController',
		      templateUrl: 'views/vendorDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  vendorUsers : $scope.vendorUsers,
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
				utils.showToast('Vendor Deleted Sucessfully!');
			}, function errorCallback(data) {
				console.log("Error");
				utils.showToast('We are Sorry. Something went wrong. Please try again later.!');
			});
			utils.showProgressBar();
		};
		
		$scope.viewVendarInformation = function(ev, $index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.vendorUsers = $scope.vendorUsers[($scope.currentPage*$scope.pageSize) + ($index)];
			$scope.isSaving = false;
			$scope.information="VIEW VENDOR INFORMATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'DialogVendorController',
						templateUrl : 'views/vendorDialog.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : false,
						fullscreen : $scope.customFullscreen,
						locals : {
							vendorUsers : $scope.vendorUsers,
							flag : $scope.flag,
							action : $scope.isReadOnly,
							information : $scope.information
						}
					})
					.then(function(answer) {},
							function() {});
		};
		
		$scope.showConfirm = function(ev,$index) {
			var confirm = $mdDialog.confirm().title(
					'Are you sure you want to Delete Vendor Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'Delete' ).cancel('Cancel');
			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteVendor(($scope.currentPage*$scope.pageSize) + ($index));
							},
							function() { });
		};
		
		$scope.gotoPrevPage = function(){
			 utils.scrollToTop();
			 $scope.currentPage = $scope.currentPage - 1;
		};
		
		$scope.gotoNextPage = function(){
			 utils.scrollToTop();
			 $scope.currentPage = $scope.currentPage + 1;
		};
		
		
});




/*erpApp.controller('vedorCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, utils, Auth) {
						$scope.isVendorPredent =false;
						$scope.vendorUser={};
					
						$rootScope.$on("callPopulateVendorList", function() {
							$scope.populateVendorList();
						});
						
						$rootScope.$on("saveVendorError", function() {
							$scope.showAddNewVendor()
						});

						$scope.populateVendorList=function(){
							 $scope.currentPage = 0;
						     $scope.pageSize = 10;
							utils.showProgressBar();
							var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "vendor/list";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
									$scope.data = response.data.data;
									$scope.isVendorInformation();
									$scope.vendorUsers = response.data;
									utils.hideProgressBar();
									console.log(response);
								}, function errorCallback(response) {
									utils.showToast("We are Sorry. Something went wrong. Please try again later.");
									console.log("Error");
									utils.hideProgressBar();
								});
						}
					$scope.isUserInformation = function() {
						$scope.isUserUnavailable = $scope.data.length === 0 ? true : false;
					};

					$scope.showAddNewUser = function(ev) {
						$scope.user = {};
						$scope.information = "ADD NEW USER"
						$scope.flag = 0;
						$scope.isReadOnly = false;
						var addNewUserDialog = {
								
							controller : 'userDialogCtrl',
							templateUrl : 'views/userDialog.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : false,
							fullscreen : $scope.customFullscreen,
							locals : {
								user : $scope.user,
								flag : $scope.flag,
								action : $scope.isReadOnly,
								information : $scope.information
							}
						};
						$mdDialog
						.show(addNewUserDialog)
						.then(function(answer) {},
								function() {});
					};
					  
					$scope.showEditUser = function(ev, $index) {
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.user = $scope.users[($scope.currentPage*$scope.pageSize) + ($index)];
						$scope.information = "EDIT USER INFORMATION"
						console.log($scope.user);
						$mdDialog
								.show({
									controller : 'userDialogCtrl',
									templateUrl : 'views/userDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : false,
									fullscreen : $scope.customFullscreen,
									locals : {
										user : $scope.user,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										information : $scope.information
									}
								})
								.then(function(answer) {},
										function() {});
					};
					
					$scope.viewUserInformation = function(ev, $index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.user = $scope.users[($scope.currentPage*$scope.pageSize) + ($index)];
						$scope.isSaving = false;
						$scope.information = "VIEW USER INFORMATION"
						console.log($scope.unit);
						$mdDialog.show({
									controller : 'userDialogCtrl',
									templateUrl : 'views/userDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : false,
									fullscreen : $scope.customFullscreen,
									locals : {
										user : $scope.user,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										information : $scope.information
									}
								})
								.then(
										function(answer) {},
										function() {});
					};
					
					$scope.deleteUser = function(index) {
						console.log($scope.user);
						var httpparams = {};
						httpparams.method = 'delete';
						httpparams.url = SERVER_URL + "user/delete/" + $scope.users[index].id;
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						$http(httpparams).then(function successCallback(data) {
							    utils.hideProgressBar();
								$rootScope.$emit("CallPopulateUserList", {});
								console.log(data);
								utils.showToast('User Deleted Sucessfully!');
								}, function errorCallback(data) {
									console.log("Error");
									utils.showToast('We are Sorry. Something went wrong. Please try again later.');
						});
						utils.showProgressBar();
					};

					$scope.showConfirm = function(ev, $index) {
						var confirm = $mdDialog.confirm()
								.title('Are you sure you want to Delete User Information?')
								.targetEvent(ev).ok('YES').cancel('NO');

						$mdDialog.show(confirm)
								.then(function() {
											$scope.deleteUser(($scope.currentPage*$scope.pageSize) + ($index));
											utils.showToast('User Deleted Sucessfully!');
										},
										function() { });
					};
					
					$scope.gotoPrevPage = function(){
						 utils.scrollToTop();
						 $scope.currentPage = $scope.currentPage - 1;
					};
					
					$scope.gotoNextPage = function(){
						 utils.scrollToTop();
						 $scope.currentPage = $scope.currentPage + 1;
					};
});
*/