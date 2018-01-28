do ->
    feature = (randomUserApi, $translate, $log, constAPP) ->
        vm = this
        vm.constant = constAPP
        $log.log '*Constant in APP:'
        $log.warn vm.constant
        vm.languagesTranslate = [
            { 
                language: 'English'
                lang: 'en-US'
            }
            {
                language: 'Portuguese'
                lang: 'pt-BR'
            }
        ]
        vm.translateLanguage = (key) ->
            if key != null
              $translate.use(key.lang)
            return
        # Example Functions
        vm.getRandomUserApi = ->
          randomUserApi.query { results: '10' }, ((data) ->
            $log.info 'The GET in randonuser.me API it was successful!'
            vm.randomUserApi = data.results
            $log.log '*The random users is:\n'
            $log.log vm.randomUserApi
            return
            # vm.randomUserApi
          ), (data) ->
            $log.error 'The GET in randonuser.me API failed!'
            $log.log data
            return       
        vm.getRandomUserApi()
        return
    'use strict'
    angular.module('ft.example').controller 'feature', feature
    feature.$inject = [
        'randomUserApi'
        '$translate'
        '$log'
        'constAPP'
    ]
    return