'use strict';

angular.module('angular-notifications', ['angular-notifications.tpls', 'ngAnimate']);
angular.module('angular-notifications.tpls', []);

angular.module("angular-notifications.tpls").run(["$templateCache", function($templateCache) {$templateCache.put("template/notification-icon.html","<div class=\"angular-notifications-container\">\r\n    <div class=\"angular-notifications-icon overlay\" ng-show=\"notification.visible\"><div ng-hide=\"notification.hideCount\">{{notification.count}}</div></div>\r\n    <div class=\"notification-inner\">\r\n        <ng-transclude></ng-transclude>\r\n    </div>\r\n</div>");}]);
/* global angular */

(function() {
  'use strict';

  var NotificationDirectiveController = function($scope, $animate) {
    var self = this;
    self.visible = false;

    var animationSet = {
      appear: self.appearAnimation || self.animation || 'pop',
      update: self.updateAnimation || self.animation || 'pop',
      disappear: self.disappearAnimation
    };

    self.init = function(element) {
      self.$element = element.find('.angular-notifications-icon');
      if (self.clearTrigger) {
        element.on(self.clearTrigger, function() {
          self.count = 0;
          $scope.$apply();
        });
      }
    };

    var handleAnimation = function(animationClass) {
      if (animationClass) {
        $animate.addClass(self.$element, animationClass).then(function() {
          self.$element.removeClass(animationClass);
        });
      }
    };

    var appear = function() {
      self.visible = true;
      handleAnimation(animationSet.appear);
      // TODO: Play sound, if requested
    };

    var clear = function() {
      self.visible = false;
      handleAnimation(animationSet.disappear);
    };

    var update = function() {
      handleAnimation(animationSet.update);
    };

    $scope.$watch(function() { return self.count; }, function() {
      if (self.visible === false && self.count > 0) {
        appear();
      } else if (self.visible === true && self.count <= 0) {
        clear();
      } else {
        update();
      }

      // Use more of a pill shape if the count is high enough.
      if (self.count > 100) {
        self.$element.addClass('wide-icon');
      } else {
        self.$element.removeClass('wide-icon');
      }
    });
  };

  var notificationDirective = function() {
    return {
      restrict: 'EA',
      scope: {
        count: '=',
        hideCount: '@',
        animation: '@',
        appearAnimation: '@',
        disappearAnimation: '@',
        updateAnimation: '@',
        clearTrigger: '@'
      },
      controller: 'NotificationDirectiveController',
      controllerAs: 'notification',
      bindToController: true,
      transclude: true,
      templateUrl: 'template/notification-icon.html',
      link: function(scope, element, attrs, ctrl) {
        ctrl.init(element);
      }
    };
  };

  angular.module('angular-notifications')
    .controller('NotificationDirectiveController', ['$scope', '$animate', NotificationDirectiveController])
    .directive('notificationIcon', notificationDirective);
}());