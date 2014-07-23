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
               } else if(element.msRequestFullscreen) {
                  element.msRequestFullscreen();
               }
            },
            cancel: function() {
               if(document.cancelFullScreen) {
                  document.cancelFullScreen();
               } else if(document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
               } else if(document.webkitCancelFullScreen) {
                  document.webkitCancelFullScreen();
               } else if(document.msExitFullscreen) {
                  document.msExitFullscreen();
               }
            },
            isEnabled: function(){
               return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
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
                  angular.element(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange', function(){
                     if(!Fullscreen.isEnabled()) {
                        setTimeout(function(){
                           $scope.$apply(function () {
                             $scope.fullscreen = false
                             $element.removeClass('isInFullScreen');
                           })
                        }, 50);
                         
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
