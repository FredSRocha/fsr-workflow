do ->
  'use strict'
  # Core Modules
  angular.module 'core', [
    # Angular Modules
    'ng'
    'ngCookies'
    'ngResource'
    'ngSanitize'
    # Reusable Modules
    'ui.router'
    'pascalprecht.translate'
  ]
  # Features Modules
  angular.module 'ft.example', []
  # Filters Modules
  # angular.module 'fltr.name', []
  # Main Module
  angular.module 'app', [
    'core'
    'ft.example'
  ]
  # Constant APPlication of asynchronous
  angular.element(document).ready ->
    initInjector = angular.injector([ 'ng' ])
    $http = initInjector.get('$http')
    $http.get('json/constants/app.json').then (response) ->
       angular.module('app').constant 'constAPP', response.data
       # Set all constants and started ng-app
       angular.bootstrap document, [ 'app' ]
       return
    , (response)->
       # Those contained in its application were not found. Please check the GET the request.
       return
    return
  return