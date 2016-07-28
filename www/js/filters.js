angular.module('skyacademy.filters', [])

.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  }
}])

.filter('htmlToPlaintext', function() {
	return function(text) {
	  return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
	};
})


.filter('cleanText', ['$sce', function($sce) {
	return function(text) {
	  return $sce.trustAsHtml(text.replace("_"," - "));
	};
}])