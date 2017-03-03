$(document).on('click', '#registerButton', function () {
    if ($(this).hasClass('empty')) {
        $('#nickname-group').show();
        $(this).removeClass('empty');
        $(this).removeClass('text-primary');
        $('#loginButton').hide();
        $('#nickname').val(Player.nickname);
    }
    else {
        var nick = $("#nickname").val();
        if (nick != "" && fbProfile.ifValidNickname(nick)) {
            saveStatistic("playerNickname", nick)
        }
        else {
            $("#login-status").text(Localization.getString('settings.notification.invalid_nick'));
            return false;
        }
        fbProfile.register();
    }
});
var fbProfile = (function (module) {
    'use strict';
    module = module || {};
    module.register = function () {
        var email = $("#email").val() || "";
        var password = $("#password").val() || "";
        
        var androidID = "nope";
        if (isAndroid())
            androidID = client.getAndroidID();
        
        firebase.database().ref('androidIDBans/'+androidID).once('value')
        .then(function(snapshot) {
            var haveBan = snapshot.val();
            if(haveBan != null) {
                $("#login-status").text(Localization.getString('chat.login.have_ban', 'You have ban. You can\'t create new account.'));
                throw new Error('have_ban');
            }
            return true;
        }).then(function() {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                $("#login-status").text(error.message);
            }).then(function () {
                if (firebase.auth().currentUser != null) {
                    var ava = avatarUrl(Player.avatar);
                    firebase.auth().currentUser.updateProfile({
                        displayName: Player.nickname
                        , photoURL: ava
                    }).then(function () {
                        var userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
                        var userSettingsRef = userRef.child('settings');
                        
                        userSettingsRef.child('language').set(Settings.language);
                        userSettingsRef.child('sounds').set(Settings.sounds);
                        userSettingsRef.child('drop').set(Settings.drop);
                        
                        var privateRef = userRef.child('private');
                        privateRef.child('double').set(Player.doubleBalance);
                        if(isAndroid())
                            privateRef.child('androidID').set(client.getAndroidID());
                        
                        var publicRef = userRef.child('public');
                        publicRef.child('points').set(Player.points);
                        publicRef.child('nickname').set(Player.nickname);
                        publicRef.child('avatar').set(ava);
                        
                        var rateRef = userRef.child('outside');
                        rateRef.child('rep').set(0);
                        
                        getInventory().then(function(result) {
                            var inventoryRef = firebase.database().ref('inventories/' + firebase.auth().currentUser.uid);
                            inventoryRef.child('inventory_count').set(result.count);
                        })
                    }, function (error) {
                        $("#login-status").text(error.message);
                    });
                }
            });
        })
        .catch(function(err) {
            if (err.message == 'have_ban') {
                
            } else {
                throw err;
            }
        })
        
    }
    module.ifAuth = function () {
        return firebase.auth().currentUser != null;
    }
    function currUid() {
        if (firebase.auth().currentUser)
            return firebase.auth().currentUser.uid;
        else
            return null;
    }
    module.currentTrade = {};
    module.isModerator = function (uid, callback) {
        uid = uid || firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + uid + '/moder/group').once('value').then(function (snapshot) {
            callback(/(admin|moder)/gi.test(snapshot.val()));
        })
    }
    module.isVip = function(uid, callback) {
        uid = uid || firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + uid + '/moder/group').once('value').then(function (snapshot) {
            callback(/(vip)/gi.test(snapshot.val()));
        })
    }
    module.getAndroidID = function (uid, callback) {
        if (typeof uid == 'function') {
            callback = uid;
            uid = currUid();
        }
        firebase.database().ref('users/'+uid+'/private/androidID').once('value').then(function(snapshot) {
            callback(snapshot.val());
        })        
    }
    module.setAndroidID = function() {
        if (isAndroid() && module.ifAuth && parseFloat(client.getCurrentAppVersionName()) >= 1.6) {
            firebase.database().ref('users/'+currUid()+'/private/androidID').set(client.getAndroidID());
        }
    }
    module.ifValidNickname = function (nick) {
        if (nick == "") return false;
        var illicitNick = /((a|а|о|o)(d|д)(m|м)(i|\||и|n)(n|и|н)|(VL(A|а)D(O|о)(S|c|с)(?:776)?))/ig;
        var validation = /^[a-zA-Zа-яёА-ЯЁ0-9_ -]+$/;
        if (validation.test(nick) && !illicitNick.test(nick)) return true;
        else return false;
    }
    module.ifValidImg = function (url) {
        if (url == '') return false
        var validation = /(^[a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif)$)/i;
        return validation.test(url);
    }
    module.forgotPassword = function (email) {
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(email).then(function () {
            $("#login-status").text("Email send.");
        }, function (error) {
            $("#login-status").text(error.message);
        })
    }
    module.showProfile = function (uid, callback) {
        var userInfoRef = firebase.database().ref('users/' + uid + '/public');
        userInfoRef.once('value').then(function (snapshot) {
            var userInfo = snapshot.val();
            userInfo.uid = uid;
            return userInfo;
        }).then(function(userInfo) {
            return firebase.database().ref('users/' + uid + '/moder').once('value').then(function(snapshot) {
                var info = snapshot.val();
                userInfo.moder = info || {};
                return userInfo;
            })
        }).then(function(userInfo) {
            callback(userInfo);
        }).catch(function(err) {
            console.log(err);
            callback(null);
        })
        if (isAndroid()) client.sendToAnalytics('Profile', 'Show profile', "User open profile", 'none');
    }
    module.showRep = function (uid, callback) {
        var userInfoRef = firebase.database().ref('users/' + uid + '/outside/rep');
        userInfoRef.once('value').then(function (snapshot) {
            var userInfo = snapshot.val();
            callback(userInfo);
        })
    }
    module.repVal = function (uid, callback) {
        var repRef = firebase.database().ref('users/' + uid + '/outside/rep');
        repRef.once('value').then(function (snapshot) {
            var rep = 0;
            var userRep = '0';
            var userUid = firebase.auth().currentUser.uid;
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val() == '+') {
                    rep++;
                    if (childSnapshot.key == userUid) userRep = '+';
                }
                else if (childSnapshot.val() == '-') {
                    rep--;
                    if (childSnapshot.key == userUid) userRep = '-';
                }
            })
            if (isAndroid()) client.sendToAnalytics('Profile', 'Change rep', "User changed reputation", userRep);
            callback(rep, userRep);
        })
    }
    module.saveAuthToPhone = function () {
        try {
            var i = 0;
            for (var key in localStorage) {
                if (/^firebase/.test(key)) {
                    saveStatistic('firebase-key ' + i, '' + key);
                    saveStatistic('firebase-value ' + i, '' + localStorage[key]);
                    i++;
                }
            }
        }
        catch (e) {}
    }
    module.setRep = function (uid, uidFrom, val) {
        var repRef = firebase.database().ref('users/' + uid + '/outside/rep');
        repRef.child(uidFrom).set(val);
    }
    module.loadPosts = function (uid, callback) {
        var userPostsRef = firebase.database().ref('users/' + uid + '/posts');
        userPostsRef.once('value').then(function (snapshot) {
            var userPosts = snapshot.val();
            callback(userPosts);
        })
    }
    module.deletePost = function (uid, key) {
        var postRef = firebase.database().ref('users/' + uid + '/posts');
        postRef.child(key).remove();
    }
    module.login = function () {
        var email = $("#email").val() || "";
        var password = $("#password").val() || "";
        if (email == "" || password == "") {
            return false;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            $("#login-status").text(error.message);
        });
        module.saveAuthToPhone();
    }
    module.newTrade = function (uidTo, weapons, accepted, callback) {
        if (!module.ifAuth) return false;
        accepted = accepted || false;
        var currUserUid = firebase.auth().currentUser.uid;
        var thisUserTradeListRef = firebase.database().ref('tradeList/' + currUserUid);
        var otherUserTradeListRef = firebase.database().ref('tradeList/' + uidTo);
        var newTradeKey = firebase.database().ref('trades').push().key;
        firebase.database().ref('trades/'+newTradeKey).child(currUserUid).set(weapons);
        var tradeInfoObject = {
            Player1 : currUserUid,
            Player2 : uidTo,
        }
        tradeInfoObject[currUserUid] = {
            weapons: weapons.length,
            accepted: accepted
        }
        firebase.database().ref('trades/'+newTradeKey+'/tradeInfo').set(tradeInfoObject);
        
        thisUserTradeListRef.child(uidTo).push().set({
            tradeID: newTradeKey
            , watched: true
        });
        otherUserTradeListRef.child(currUserUid).push().set({
            tradeID: newTradeKey
            , watched: false
        });
        if (typeof callback == 'function') callback({tradeID: newTradeKey});
    }
    module.deleteTradesWithUser = function(uid, callback) {
        var tradesRef = firebase.database().ref('tradeList/'+firebase.auth().currentUser.uid+'/'+uid);
        
        tradesRef.remove();
        callback(true);
    }
    module.myTradeCount = function (unwatched, callback) {
        unwatched = typeof unwatched == 'undefined' ? true : unwatched;
        var tradeListRef = firebase.database().ref('tradeList/' + firebase.auth().currentUser.uid).once('value').then(function (snapshot) {
            //var tradesList = snapshot.val();
            var trCount = 0;
            snapshot.forEach(function (childSnapshot) {
                childSnapshot.forEach(function (childChildSnapshot) {
                    if ((unwatched && childChildSnapshot.val().watched == false) || !unwatched) trCount++;
                })
            })
            callback(trCount);
        })
    }
    module.getMyTrades = function (callback) {
        var currUid = firebase.auth().currentUser.uid;
        var myTrades = [];
        var tradeListRef = firebase.database().ref('tradeList/' + currUid).once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var currentUserTrade = {
                    tradeWith: {
                        uid: childSnapshot.key
                    , }
                    , trades: []
                };
                childSnapshot.forEach(function (trade) {
                    var tr = trade.val();
                    tr.key = trade.key;
                    currentUserTrade.trades.push(tr);
                })
                myTrades.push(currentUserTrade);
            });
        }).then(function () {
            callback(myTrades)
        })
    }
    module.tradeInfoShort = function (tradeID, callback) {
        var currentUid = currUid();
        var trade = firebase.database().ref('trades/' + tradeID+'/tradeInfo').once('value').then(function (snapshot) {
            var tradeInfo = snapshot.val();
            //tradeInfo.otherPlayer = Object.keys(tradeInfo)[0];
            if (tradeInfo.Player1 == currentUid) {
                tradeInfo.otherPlayer = tradeInfo[tradeInfo.Player2] || {};
                tradeInfo.player = tradeInfo[tradeInfo.Player1] || {};
                tradeInfo.otherPlayer.id = tradeInfo.Player2;
                tradeInfo.player.id = tradeInfo.Player1;
            } else {
                tradeInfo.otherPlayer = tradeInfo[tradeInfo.Player1] || {};
                tradeInfo.player = tradeInfo[tradeInfo.Player2] || {};
                tradeInfo.otherPlayer.id = tradeInfo.Player1;
                tradeInfo.player.id = tradeInfo.Player2;
            }
            tradeInfo.otherPlayer.weapons = tradeInfo.otherPlayer.weapons || 0;
            tradeInfo.player.weapons = tradeInfo.player.weapons || 0;
            //var currentUid = currUid();
            tradeInfo.tradeID = tradeID;
            callback(tradeInfo);
        })
    }
    module.tradeInfo = function (tradeID, callback) {
        var currentUid = currUid();
        var trade = firebase.database().ref('trades/' + tradeID).once('value').then(function (snapshot) {
            var tradeInfo = snapshot.val();
            if (tradeInfo.tradeInfo.Player1 == currentUid) {
                tradeInfo.otherPlayer = tradeInfo.tradeInfo[tradeInfo.tradeInfo.Player2] || {};
                tradeInfo.otherPlayer.weapons = tradeInfo[tradeInfo.tradeInfo.Player2] || [];
                tradeInfo.otherPlayer.id = tradeInfo.tradeInfo.Player2;
                tradeInfo.player = tradeInfo.tradeInfo[tradeInfo.tradeInfo.Player1] || {};
                tradeInfo.player.weapons = tradeInfo[tradeInfo.tradeInfo.Player1] || [];
                tradeInfo.player.id = tradeInfo.tradeInfo.Player1;
            } else {
                tradeInfo.otherPlayer = tradeInfo.tradeInfo[tradeInfo.tradeInfo.Player1] || {};
                tradeInfo.otherPlayer.weapons = tradeInfo[tradeInfo.tradeInfo.Player1] || [];
                tradeInfo.otherPlayer.id = tradeInfo.tradeInfo.Player1;
                tradeInfo.player = tradeInfo.tradeInfo[tradeInfo.tradeInfo.Player2] || {};
                tradeInfo.player.weapons = tradeInfo[tradeInfo.tradeInfo.Player2] || [];
                tradeInfo.player.id = tradeInfo.tradeInfo.Player2;
            }
            tradeInfo.tradeID = tradeID;
            callback(tradeInfo);
        })
    }
    module.updateTradeOffer = function(tradeID, weapons, callback) {
        firebase.database().ref('trades/'+tradeID+'/'+currUid()).set(weapons);
        firebase.database().ref('trades/'+tradeID+'/tradeInfo/'+currUid()+'/weapons').set(weapons.length);
        callback();
    }
    module.tradeStatus = function(tradeID, callback) {
        firebase.database().ref('trades/'+tradeID+'/tradeInfo/status').once('value')
        .then(function(snapshot) {
            var stat = snapshot.val();
            if (stat == null) stat = 'not ready';
            callback(stat);
        })
    }
    module.setTradeStatus = function(tradeID, status) {
        firebase.database().ref('trades/'+tradeID+'/tradeInfo/status').set(status);
    } 
    module.setTradeGetWeaponsStatus = function(tradeID, status) {
        if (status == true) status = firebase.database.ServerValue.TIMESTAMP;
        firebase.database().ref('trades/'+tradeID+'/tradeInfo/'+firebase.auth().currentUser.uid+'/getWeapons').set(status);
    }
    module.getChangeOfferTime = function(tradeID, uid, callback) {
        firebase.database().ref('trades/'+tradeID+'/tradeInfo/'+uid+'/changeOffer').once('value')
        .then(function(snapshot) {
            callback(snapshot.val());
        }) ;
    }
    module.setChangeOfferTime = function(tradeID) {
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('trades/'+tradeID+'/tradeInfo/'+uid+'/changeOffer').set(firebase.database.ServerValue.TIMESTAMP);
    }
    module.getTradeWeapons = function(tradeID, weaponsID) {
        firebase.database().ref('trades/'+tradeID+'/'+weaponsID).once('value').then(function(data) {
            var weapons = data.val();
            if (weapons != null) {
                for (var i = 0; i < weapons.length; i++) {
                    var wp = fbInventory.reverseConvert(weapons[i]);
                    wp.new = true;
                    saveWeapon(wp);
                }
            }
            module.setTradeGetWeaponsStatus(tradeID, true);
            checkInventoryForNotification();
        })
    }
    module.XSSreplace = function (text) {
        var allowedTags = ["<br>", "<i>", "<b>", "<s>"];
        //allowed html tags
        
        if (typeof text !== 'string') return text;
        
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&amp;/g, '&');
        for (var i = 0; i < allowedTags.length; i++) {
            text = rpls(text, allowedTags[i]);
        }
        //XSS replace
        text = text.replace(/&/g, '&amp;');
        text = text.replace(/</g, '&lt;');
        text = text.replace(/>/g, '&gt;');
        text = text.replace(/"/g, '&quot;');
        text = text.replace(/'/g, '&#x27;');
        //text = text.replace(/\//g, '&#x2F;');
        //allowed html tags
        for (var i = 0; i < allowedTags.length; i++) {
            text = rpls(text, allowedTags[i], true);
        }
        return text;

        function rpls(text, tag, revert) {
            revert = revert || false;
            var inTag = tag.replace(/(<|>)/g, '');
            if (!revert) {
                var reg = new RegExp('<([/])?' + inTag + '>', 'gi');
                text = text.replace(reg, '!!$1' + inTag + '!!');
            }
            else {
                var reg = new RegExp('!!([/])?' + inTag + '!!', 'gi');
                text = text.replace(reg, '<$1' + inTag + '>');
            }
            return text;
        }
    }
    return module;
}(fbProfile || {}))