'use strict';

angular.module('lifeApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
           .state('app', {
                url:'/',
                views: {
                     'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'PostController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
            // route for the news page
             .state('app.news', {
                url:'news',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/news.html',
                        controller  : 'PostController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
            // route for the aboutus page
            .state('app.health', {
                url:'health',
               views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/health.html',
                        controller  : 'PostController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }
            })
            // route for the lifestyle page
             .state('app.life', {
                url:'lifestyle',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/life.html',
                        controller  : 'PostController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
             // route for the favorites page
              .state('app.favorites', {
                url:'favorites',
               views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }
            })
        
        
            // route for the dishdetail page
            .state('app.postdetails', {
                url: 'home/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/postdetail.html',
                        controller  : 'PostDetailController'
                   }
                }
            }) ;
    
        $urlRouterProvider.otherwise('/');
    })
;