do ->
  Config = ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider) ->
    $urlRouterProvider.otherwise '/'
    $stateProvider.state('home',
      url: '/'
      views:
        '':
          templateUrl: 'templates/main.html'
          controller: 'feature'
          controllerAs: 'vm'
        'header@home':
          templateUrl: 'templates/header/header.html'
        'body@home':
          templateUrl: 'templates/body/body.html'
        'footer@home':
          templateUrl: 'templates/footer/footer.html').state 'application',
      url: '/application'
      templateUrl: 'templates/application/application.html'
      controller: 'feature'
      controllerAs: 'vm'
    $locationProvider.html5Mode(true)
    # $locationProvider.hashPrefix('!')
    # Translate Pages
    $translateProvider
      .useStaticFilesLoader
        prefix: 'json/languages/'
        suffix: '.json'
      .useLocalStorage()
      .preferredLanguage 'pt-BR'
      # Enable escaping of HTML
      .useSanitizeValueStrategy null
    return
  'use srtict'
  angular.module('ft.example').config Config
  Config.$inject = [
    '$stateProvider'
    '$urlRouterProvider'
    '$translateProvider'
    '$locationProvider'
  ]
  return