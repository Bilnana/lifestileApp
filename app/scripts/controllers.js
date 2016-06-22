'use strict';

angular.module('lifeApp')

		

        .controller('ContactController',['$scope', 'menuFactory', function($scope, menuFactory) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])
		

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.getFeedback().save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])
		
    .controller('PostController', ['$scope', '$stateParams','postFactory' ,'favoriteFactory', function($scope, $stateParams, postFactory,favoriteFactory) {
				
                $scope.showPosts= false;
                $scope.message = "Loading ...";
                       postFactory.query(
                    function(response) {
                        $scope.posts= response;
                        $scope.showPosts= true;
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    });
            
        
                //add favorite function
                  $scope.addToFavorites = function(postid) {
                    console.log('Add to favorites', postid);
                    favoriteFactory.save({_id: postid});
                    $scope.showFavorites = !$scope.showFavorites;
                };
		}])


    .controller('PostDetailController', ['$scope', '$state', '$stateParams', 'postFactory', 'commentFactory', function ($scope, $state, $stateParams, postFactory, commentFactory) {

    $scope.post = {};
    $scope.showPost = false;
    $scope.message = "Loading ...";

    $scope.post = postFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.post = response;
                $scope.showPost = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.mycomment = {
        comment: ""
    };

    $scope.submitComment = function () {

        commentFactory.save({id: $stateParams.id}, $scope.mycomment);

        $state.go($state.current, {}, {reload: true});
        
        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            comment: ""
        };
    }
}])

					
		
	 .controller('PostCommentController', ['$scope', 'postFactory', function($scope,postFactory) {
            
            //Step 1: Create a JavaScript object to hold the comment from the form
            $scope.comment={comment:"",author:"", date:""};
			 
			
            $scope.submitComment = function () {
                
                //Step 2: This is how you record the date
                $scope.comment.date =new Date().toISOString();
                 console.log($scope.mycomment);
                // Step 3: Push your comment into the dish's comment array
                $scope.post.comments.push($scope.comment);
                
                //Step 4: reset your form to pristine
                postFactory.getPosts().update({id:$scope.post.id},$scope.post);
				$scope.commentForm.setPristine();
				
                //Step 5: reset your JavaScript object that holds your comment
				$scope.comment={rating:5, comment:"",author:"",date:""};
				
                   
            }
			 
        }])

    .controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showPosts = false;
    $scope.message = "Loading ...";

    favoriteFactory.query(
        function (response) {
            $scope.posts = response.posts;
            $scope.showPosts = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };
    
    $scope.deleteFavorite = function(postid) {
        console.log('Delete favorites', postid);
        favoriteFactory.delete({id: postid});
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, {reload: true});
    };
            }])

   .controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])

;

	
	
	