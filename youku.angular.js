angular.module('windht.Youku',[]).factory('Youku',function($http,$q){
  function getFileIDMixString(seed){
      var source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890".split(''),
        mixed = [],index;
      for (var i=0, len = source.length; i< len;i++){
        seed = (seed * 211 + 30031) % 65536;
        index = Math.floor(seed/65536 * source.length);
        mixed.push(source[index]);
        source.splice(index,1);
      }
      return mixed.join('');
    };
  function getFileID(fileid, seed){
    var mixed = getFileIDMixString(seed), ids= fileid.split("*"), realId = [], idx;
    for (var i=0; i< ids.length; i++){
      idx = parseInt(ids[i],10);
      realId.push(mixed.charAt(idx));
    }
    return realId.join('');
  };

  function na(a) {
        if (!a) return "";
        a = a.toString();
        var c, b, f, i, e, h = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
        i = a.length;
        f = 0;
        for (e = ""; f < i;) {
            do {
                c = h[a.charCodeAt(f++) & 255];
            } while (f < i && -1 == c);
            if (-1 == c) break;
            do {
                b = h[a.charCodeAt(f++) & 255];
            } while (f < i && -1 == b);
            if (-1 == b) break;
            e += String.fromCharCode(c << 2 | (b & 48) >> 4);
            do {
                c = a.charCodeAt(f++) & 255;
                if (61 == c) return e;
                c = h[c];
            } while (f < i && -1 == c);
            if (-1 == c) break;
            e += String.fromCharCode((b & 15) << 4 | (c & 60) >> 2);
            do {
                b = a.charCodeAt(f++) & 255;
                if (61 == b) return e;
                b = h[b];
            } while (f < i && -1 == b);
            if (-1 == b) break;
            e += String.fromCharCode((c & 3) << 6 | b);
        }
        return e;
    }

    function D(a) {
        if (!a) return "";
        a = a.toString();
        var c, b, f, e, g, h;
        f = a.length;
        b = 0;
        for (c = ""; b < f;) {
            e = a.charCodeAt(b++) & 255;
            if (b == f) {
                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4);
                c += "==";
                break;
            }
            g = a.charCodeAt(b++);
            if (b == f) {
                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2);
                c += "=";
                break;
            }
            h = a.charCodeAt(b++);
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2 | (h & 192) >> 6);
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h & 63);
        }
        return c;
    }

    function E(a, c) {
        var q;
        for (var b = [], f = 0, i, e = "", h = 0; 256 > h; h++) b[h] = h;
        for (h = 0; 256 > h; h++) f = (f + b[h] + a.charCodeAt(h % a.length)) % 256, i = b[h], b[h] = b[f], b[f] = i;
        for (q = f = h = 0; q < c.length; q++) h = (h + 1) % 256, f = (f + b[h]) % 256, i = b[h], b[h] = b[f], b[f] = i, e += String.fromCharCode(c.charCodeAt(q) ^ b[(b[h] + b[f]) % 256]);
        return e;
    }

    function F(a, c) {
        var i;
        for (var b = [], f = 0; f < a.length; f++) {
            for (i = 0, i = "a" <= a[f] && "z" >= a[f] ? a[f].charCodeAt(0) - 97 : a[f] - 0 + 26, e = 0; 36 > e; e++)
                if (c[e] == i) {
                    i = e;
                    break;
                }
            b[f] = 25 < i ? i - 26 : String.fromCharCode(i + 97);
        }
        return b.join("");
    }

    function youku(res) {
        var a, c;
        var sid, fileid, k, ts, token, oip, ep;
        a = res["data"][0],
        c = E(F("b4eto0b4", [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), na(a.ep));
        sid = c.split("_")[0];
        token = c.split("_")[1];
        fileid = getFileID(res["data"][0]["streamfileids"]["3gphd"], res["data"][0]["seed"]);
        k = res["data"][0]["segs"]["3gphd"][0]["k"];
        ts = res["data"][0]["segs"]["3gphd"][0]["seconds"];
        oip = res["data"][0]["ip"];
        ep = encodeURIComponent(D(E(F("boa4poz1", [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + fileid + "_" + token)));
        return {
            sid: sid,
            fileid: fileid,
            k: k,
            ts: ts,
            token: token,
            oip: oip,
            ep: ep
        }
    }


  return {
    getVideoSrc:function(vid) {
      var deferred = $q.defer();
      $http.jsonp("http://v.youku.com/player/getPlaylist/VideoIDS/"+vid+"/Pf/4/ctype/12/ev/1__callback=JSON_CALLBACK").success(function(param){
          var yk=youku(param);
          var url = "http://k.youku.com/player/getFlvPath/sid/" + yk.sid;
          url += "_00/st/mp4/fileid/" + yk.fileid;
          url += "?K=" + yk.k;
          url += "&hd=1&myp=0";
          url += "&ts=" + yk.ts;
          url += "&ypp=0&ctype=12&ev=1";
          url += "&token=" + yk.token;
          url += "&oip=" + yk.oip;
          url += "&ep=" + yk.ep;
          deferred.resolve(url);
      }).error(function(param){
        deferred.reject(param);
      })

      return deferred.promise;
    }
  }
})
.directive('youkuId', function ($rootScope, $timeout,Youku) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      Youku.getVideoSrc(attrs.youkuId).then(function(url){
        element.attr('src',url);
      })
      
    }
  }
})