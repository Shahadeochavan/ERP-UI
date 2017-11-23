erpApp.controller(
				'RMVendorAssociationDialogCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,rmOrderAssociation,flag,action,title,dropdownAction,$timeout, $q, $log){
					$scope.isReadOnly = action;
					$scope.flag = flag;
					$scope.rmOrderAssociation = rmOrderAssociation;
					$scope.title = title;
					/*$scope.isRawMaterial = false;
					$scope.isVendor false;*/
					
					
					$scope.isDropDownreadOnly = dropdownAction;
					$scope.hide = function() {
						console.log('hide DialogController');
						$mdDialog.hide();
					};
					

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
					};

					$scope.saveRMOrderAssociation = function() {
						var data = {
								product:$scope.clientProductAssociation.product.id,
								client:$scope.clientProductAssociation.client.id,
								pricePerUnit:$scope.clientProductAssociation.pricePerUnit
						};
						var httpparams = {};
						if ($scope.flag == 0) {
							console.log($scope.clientProductAssociation);
							console.log($scope.data);
							httpparams.method = 'post';
							httpparams.url = SERVER_URL + "clientProducAsso/create";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
						} else {
							console.log($scope.clientProductAssociation);
							data.id = $scope.clientProductAssociation.id;
							httpparams.method = 'put';
							httpparams.url = SERVER_URL + "clientProducAsso/update";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
						}
						httpparams.data = data;
						$http(httpparams)
								.then(
										function successCallback(data) {
											$mdDialog.hide();
											console.log(data);
											if(data.data.code === 0){
												console.log(data.data.message);
												console.log(data);
												$scope.hide();
												utils.showToast('Something went worng. Please try again later.');
											}else if(data.data.code === 2){
												$scope.hide();
												$rootScope.$emit(
														"saveRMOrderAssociationError", {});
												utils.showToast(data.data.message);
											}
											
											else{
												console.log(data.data.message);
												$scope.displayProgressBar = false;
												utils.showToast('Raw Material Vendor Association Information saved successfully.');
												/*$rootScope.$emit(
														"saveRMOrderAssociationError", {});*/
												utils.hideProgressBar();
												$rootScope.$emit("CallPopulateRMVendorAssociationList",{});
											}
										},
										function errorCallback(data) {
											$rootScope.$emit(
													"saveRMOrderAssociationError", {});
											console.log(data);
											$scope.hide();
											utils.showToast('Something went worng. Please try again later.');
										});
					};

					$scope.submitRMVendorAssociationInformation = function(isvaliduser,$event) {
						if (isvaliduser) {
							$scope.saveRMOrderAssociation();
						} else {
							console.log('its else block');
							utils.showToast('Please fill all required information');
						}
					};
					
					    $scope.getProduts=function(){
					    	var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "product/list";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.products = response.data.data;
							}, function errorCallback(response) {
								console.log("Error");
							});
					    };
				
					   $scope.getClient=function(){
						   var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "client/list";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.clients = response.data.data;
								console.log(response);
							}, function errorCallback(response) {
								console.log("Error");
							});
					   };
					   
});