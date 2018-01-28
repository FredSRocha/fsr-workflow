do ->
  randomUserApi = ($resource) ->
    $resource 'https://randomuser.me/api/?results=:results', {}, query:
      method: 'get'
      results: '@results'
      isArray: false
  'use strict'
  # The method GET in randonuser.me API was created.
  ### 
  #  Example of how to consume an API using REST:
  #  A factory which creates a resource object that lets you interact with RESTful server-side data sources.
  #  - More info: https://docs.angularjs.org/api/ngResource/service/$resource
  ###
  angular.module('app').factory 'randomUserApi', randomUserApi
  randomUserApi.$inject = [
    '$resource'
  ]
  return