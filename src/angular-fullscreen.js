(function(window) {
   var createModule = function(angular) {
      var module = angular.module('FBAngular', []);

      module.factory('Fullscreen', ['$document', function ($document) {
         var document = $document[0];

         return {
            all: function() {
               this.enable( document.documentElement );
            },
            enable: function(element) {
               if(element.requestFullScreen) {
                  element.requestFullScreen();
               } else if(element.mozRequestFullScreen) {
                  element.mozRequestFullScreen();
               } else if(element.webkitRequestFullScreen) {
                  element.webkitRequestFullScreen();
               }
            },
            cancel: function() {
               if(document.cancelFullScreen) {
                  document.cancelFullScreen();
               } else if(document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
               } else if(document.webkitCancelFullScreen) {
                  document.webkitCancelFullScreen();
               }
            },
            isEnabled: function(){
               var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
               return fullscreenElement;
            }
         };
      }]);

      module.directive('fullscreen', ['Fullscreen',  function(Fullscreen) {
         return {
            scope: {
                fullscreen: '=?'
            },
            link : function ($scope, $element, $attrs) {
               if ($attrs.fullscreen) {
                  $scope.$watch('fullscreen', function(value) {
                     var isEnabled = Fullscreen.isEnabled();
                     if (value && !isEnabled) {
                        Fullscreen.enable($element[0]);
                        $element.addClass('isInFullScreen');
                     } else if (!value && isEnabled) {
                        Fullscreen.cancel();
                        $element.removeClass('isInFullScreen');
                     }
                  });
                  angular.element(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange', function(){
                     if(!Fullscreen.isEnabled()) {
                         $scope.$apply(function () {
                             $scope.fullscreen = false
                             $element.removeClass('isInFullScreen');
                         })
                     }
                  })
               } else {
                  $element.on('click', function (ev) {
                     Fullscreen.enable(  $element[0] );
                  });
               }
            }
         };
      }]);
      return module;
   };

   if (typeof define === "function" && define.amd) {
      define("FBAngular", ['angular'], function (angular) { return createModule(angular); } );
   } else {
      createModule(window.angular);
   }
})(window);
