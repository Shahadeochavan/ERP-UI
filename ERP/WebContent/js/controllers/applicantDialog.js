erpApp.controller('applicantDialog', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,page,action,flag,information) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.page = page;
	$scope.information = information;
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

	$scope.savePageInformation = function(ev) {
		var data = {
				fullName : $scope.applicant.fullName,
				mobileNumber : $scope.applicant.mobileNumber,
				emailId : $scope.applicant.emailId,
				customerId : $scope.applicant.customerId,
				createDate : $scope.applicant.createDate,
				validity : $scope.applicant.validity,
				paidUnpaid : $scope.applicant.paidUnpaid,
				formSubmission : $scope.applicant.formSubmission,
				price : $scope.applicant.price,
				product:$scope.applicant.product.id,
				client:$scope.applicant.client.id
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "applicant/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.unit);
			data.id = $scope.bankDetail.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "applicant/update";
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
								$rootScope.$emit(
										"saveUnitError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.');
							}else{
								$scope.displayProgressBar = false;
								utils.showToast(data.data.message);
								$rootScope.$emit("CallPopulatePageList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveUnitError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	};
	 $scope.getProduts=function() {
	 var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "product/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
	 $http(httpparams).then(function successCallback(response) {
			$scope.products = response.data.data;
			console.log(response);
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
	$scope.submitPageInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.savePageInformation($event)
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};
});