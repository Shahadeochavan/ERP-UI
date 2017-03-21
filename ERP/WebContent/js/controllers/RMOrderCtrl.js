erpApp.controller('rmOrderCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils) {
	$scope.isReadOnly = false;
	$rootScope.$on("CallPopulateRMOrderList", function() {
		$scope.populateRMOrderList();
	});
	$rootScope.$on("saveRMOrderError", function() {
		$scope.showAddNewRMOrder();
	});

	$scope.populateRMOrderList = function() {
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterialorder/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.rmOrders = response.data;
			$scope.isRMOrderInformation();
			utils.hideProgressBar();
			console.log(response);

		}, function errorCallback(response) {
			/*$scope.message = "We are Sorry. Something went wrong. Please try again later."
			$scope.showToast();*/
			utils.showToast('We are Sorry. Something went wrong. Please try again later.');
			console.log("Error");
			utils.hideProgressBar();
		});
	}
	
	$scope.isRMOrderPresent=false;
	$scope.isRMOrderInformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isRMOrderPresent=true;
			}
		else
			{
			$scope.isRMOrderPresent=false;
			}
	}
	

	
	$scope.rmOrder = {};
	$scope.showAddNewRMOrder = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.rmOrder = {};
		$scope.title= "ADD RAW MATERIAL ORDER INFORMATION";
		var addNewRmDialog = {
			controller : 'rmOrderDialogCtrl',
			templateUrl : 'views/RMOorderInfo.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				rmOrder : $scope.rmOrder,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				title : $scope.title,
			}
		};
	
		
		$mdDialog
		.show(addNewRmDialog)
		.then(function(answer) {},
				function() {})
	};
	
	$scope.showRMOrder = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.rmOrder = $scope.rmOrders[index];
		console.log($scope.rmOrder);
		$scope.title="EDIT RAW MATERIAL ORDER INFORMATION"
		$mdDialog
				.show({
					controller : 'rmOrderDialogCtrl',
					templateUrl : 'views/RMOorderInfo.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						rmOrder : $scope.rmOrder,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						title : $scope.title,
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	
	$scope.viewRmOrder = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.rmOrder = $scope.rmOrders[index];
		$scope.isSaving = false;
		$scope.title = "VIEW RAW MATERIAL ORDER INFORMATION"
		console.log($scope.rmOrder);
		$mdDialog.show({
					controller : 'rmOrderDialogCtrl',
					templateUrl : 'views/RMOorderInfo.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						rmOrder : $scope.rmOrder,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						title : $scope.title,
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	$scope.deleteRmOrder = function(index) {
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "rawmaterialorder/delete/" +  $scope.rmOrders[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			utils.hideProgressBar();
			$rootScope.$emit("CallPopulateRMOrderList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");

		});
		utils.showProgressBar();

	};

	$scope.showConfirm = function(ev,index) {
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete Raw Material Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'Delete' ).cancel('Cancel');

		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteRmOrder(index);
							utils.showToast('RM Order Deleted Sucessfully!');
							
						},
						function() { });
	};
	
});
