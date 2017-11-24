erpApp.controller('DialogVendorController', function($scope,$http, $mdDialog,vendorUsers,flag,action,$rootScope,$mdToast,information,Auth,utils,SERVER_URL) {
	  $scope.vendorUsers=vendorUsers;
	    $scope.flag=flag;
	    $scope.isReadOnly = action;
	    $scope.information = information;
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };

	    $scope.answer = function(answer) {
	      $mdDialog.hide(answer);
	    };
	    
	    $scope.saveVendorInfo=function(ev){
	    	 console.log($scope.data)
	    	 var data = {
	    		 companyName : $scope.vendorUsers.companyName,
	    		 email: $scope.vendorUsers.email,
	    		 firstName : $scope.vendorUsers.firstName ,
	    		 lastName : $scope.vendorUsers.lastName,
	    		 address : $scope.vendorUsers.address, 
	    		 contactNumberMobile : $scope.vendorUsers.contactNumberMobile,
	    		 contactNumberOffice: $scope.vendorUsers.contactNumberOffice,
	    		 city : $scope.vendorUsers.city,
	    		 state : $scope.vendorUsers.state,
	    		 postalcode : $scope.vendorUsers.postalcode,
	    		 description: $scope.vendorUsers.description,
	    		 commisionerate: $scope.vendorUsers.commisionerate,
	    		 cst: $scope.vendorUsers.cst,
	    		 customerEccNumber: $scope.vendorUsers.customerEccNumber,
	    		 divison: $scope.vendorUsers.divison,
	    		 vatNo: $scope.vendorUsers.vatNo,
	    		 renge: $scope.vendorUsers.renge
				};
	    	 var httpparams = {};
	    	 if($scope.flag==0){
	    		    httpparams.method='post',
	    		    httpparams.url=SERVER_URL + "vendor/create"
	    		    httpparams.headers = {
	    					auth_token : Auth.getAuthToken()
	    				};
	    		 }
	    	 else{
	    		      data.id=$scope.vendorUsers.id,
	    		      httpparams.method='put',
	    		      httpparams.url=SERVER_URL + "vendor/update"
	    		      httpparams.headers = {
		    					auth_token : Auth.getAuthToken()
		    				};
	    		 }
	    	 httpparams.data=data;
	    	 $http(httpparams)
	    	 .then(
						function successCallback(data) {
							$mdDialog.hide();
							console.log(data);
							if(data.data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveVendorError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								utils.showToast();
							}
							else if(data.data.code===2){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveVendorError", {});
								console.log(data);
								$scope.hide();
								/*$scope.message = data.data.message;*/
								utils.showToast(data.data.message);
								/*$scope.message = data.data.message;
								utils.showToast();	*/		 
								}else{
							/*	$scope.displayProgressBar = false;*/
								utils.showToast('Vendor Information saved successfully.');
								$rootScope.$emit("callPopulateVendorList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveVendorError", {});
							console.log(data);
							$scope.hide();
							$scope.hide();
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	    };
	    
	
	    
    		$scope.submitVendorInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveVendorInfo();
			} else {
				console.log('its else block');
				utils.showToast('Please fill all required information');
			}
		}
});