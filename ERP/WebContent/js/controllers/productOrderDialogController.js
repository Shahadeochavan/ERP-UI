erpApp.controller('productOrderDialogCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,productOrder,utils,flag,action,information,hideAction,clientAction) {
	  
	$scope.productOrder=productOrder;
    $scope.flag=flag;
    $scope.isReadOnly = action;
    $scope.information = information;
    $scope.isProductOrderAdd = hideAction;
    $scope.isClientReadOnly = clientAction;
    $rootScope.isAddButtonDisplay=true;
    $scope.orderproductassociations=[];
    $scope.orderProductAssociation={};
    $scope.productOrder.createDate = new Date($scope.productOrder.createDate);
   
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    
    $scope.saveProductOrder = function() {
    	var data = {
    			 orderproductassociations : $scope.orderproductassociations,
    			 description:$scope.productOrder.description,
    			 quantity:$scope.productOrder.quantity,
    			 totalAmount:$scope.totalAmount,
    			 receivedAmount:$scope.productOrder.receivedAmount,
    			 createDate:$scope.productOrder.createDate ,
    			  clientId:$scope.productOrder.clientId.id,
    			  product:$scope.productOrder.product.id
		};
    	var httpparams = {};
    	if($scope.flag === 0){
    		httpparams.method = 'post';
 			httpparams.url = SERVER_URL + "productorder/createMultiple";
 			httpparams.headers = {
 					auth_token : Auth.getAuthToken()
 			};
    	}else{
    		 data.id=$scope.productOrder.id;
    		httpparams.method='put',
    		httpparams.url=SERVER_URL + "productorder/update"
    		httpparams.headers = {
					auth_token : Auth.getAuthToken()
			};
    	}
    	httpparams.data = data;
    	$http(httpparams).then(
			function successCallback(data) {
				$mdDialog.hide();
				console.log(data);
				if(data.data.code === 0){
					console.log(data.data.message);
					$rootScope.$emit(
							"saveVendorError", {});
					console.log(data);
					$scope.hide();
					utils.showToast(data.data.message);
				}
				else{
					$scope.displayProgressBar = false;
					$rootScope.$emit("callPopulateProductOrderList",{});
					utils.showToast(data.data.message);
				}
			},
			function errorCallback(data) {
				$rootScope.$emit("saveVendorError", {});
				console.log(data);
				$scope.hide();
				utils.showToast('Something went worng. Please try again later.');
			});
    	};

	$scope.submitInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveProductOrder($event);
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};
    
	 /*$scope.getProducts=function() {
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
	    };*/
	    
	   /* $scope.getClient=function(){
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
	    };*/
	    
	    $scope.getClient=function(){
	    	var httpparams={};
	    	httpparams.method = 'GET';
	    	httpparams.url = SERVER_URL + "client/list";
	    	httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		 $http(httpparams).then(function successCallback(response) {
				$scope.clientProducAsso = response.data.data;
				console.log("$scope.clientProducAsso:",$scope.clientProducAsso)
			}, function errorCallback(response) {
				console.log("Error");
			});
	    };
	    
	    $scope.getProducts = function(){
	    	var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "clientProducAsso/ProductList/" + $scope.productOrder.clientId.id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		 $http(httpparams).then(function successCallback(response) {
				$scope.productList = response.data.data;
				console.log("$scope.productList:",$scope.productList);
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
			});
	    }
	    
	    
	    $scope.calculateTotalPrice = function(quantity,pricePerUnit){
	    	console.log("productOrder.quantity:",quantity);
	    	console.log("clientProducAsso:" ,$scope.clientProducAsso);
	    	console.log("pricePerUnit",pricePerUnit);
	    	$scope.totalAmount = pricePerUnit * quantity;
	    	console.log("$scope.totalPrice:",$scope.totalAmount);
	    };
	    
	    $scope.addOrderProductAssociation = function(){
	    	console.log('Adding RM : ', $scope.orderProductAssociation);
	    	if( !angular.equals($scope.orderProductAssociation,{}) ){
	    		if(!$scope.isDuplicateRM($scope.orderProductAssociation)){
				   $scope.orderproductassociations.push($scope.orderProductAssociation);	
				   $scope.orderProductAssociation = {};
				   $scope.productOrderInformation.product.$setValidity("message", true);
				   console.log('setting validity true')
				   $scope.message="";
	    		}else{
	    			$scope.message = 'This Product is already added';
					$scope.productOrderInformation.product.$setValidity("message", false);
	    		}
			}
	    };
	    
	    $scope.isDuplicateRM = function(orderProductAssociation) {
			for (var i = 0; i < $scope.orderproductassociations.length; i++) {
				if ($scope.orderproductassociations[i].product.id === orderProductAssociation.product.id) {
					return true;
				}
			}
			return false;
		};
	    
	    $scope.deleteProduct=function(index){
	    	console.log('delted products' +  $scope.orderproductassociations)
	    	var lastItem = $scope.orderproductassociations.length;
		    $scope.orderproductassociations.splice(index,1);
	    };
	    
	    $scope.getProductOrderId=function() {
	    	if($scope.productOrder.id){
	    	var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productorder/productorderId/"+ $scope.productOrder.id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(response) {
				$scope.productOrderList = response.data;
				console.log(response);
	             console.log('product order list' + $scope.productOrderList);
			}, function errorCallback(response) {
				console.log("Error");
			});
	   }
	    };
	    
	    $scope.updateQuantity = function(quantity){
	    	console.log(quantity);
	    	if(quantity < 0){
	    		 $scope.updateQuantityMsg="Invalid price!! Price should be greater than 0";
	   			  $scope.productOrderInformation.quantity.$setValidity("customMsg", false);
	    		 console.log("its if block");
	    	}else{
	    		 $scope.productOrderInformation.quantity.$setValidity("customMsg", true);
	    		 console.log("its else block")
	    	}
	    };
	    
	  $scope.orderDateValidation = function(expecteddeliveryDate){
		  console.log("expected deliver date" + expecteddeliveryDate);
		  $scope.currentDate = new Date();
		  console.log("current date" +  $scope.currentDate);
		  if(expecteddeliveryDate <= $scope.currentDate){
			  console.log("its if condition");
			  $scope.msg="Date should be greater then current date";
			  $scope.productOrderInformation.expecteddeliveryDate.$setValidity("customeMsg", false);
		  }else{
			     console.log("its else block");
			     $scope.productOrderInformation.expecteddeliveryDate.$setValidity("customeMsg", true);
		  }
	  };
});