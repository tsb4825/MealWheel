/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    goodRestaurants: 0,
    badRestaurants: 0,
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        if (isDevice()) {
            navigator.splashscreen.hide();
            adMobService.setupAds();
            loadAllAudio();
        }
        setTimeout(function () {
            showScreen("splash", "home");

            $('#addWedgeModal').on('shown.bs.modal', function () {
                $('#txtRestaurant').focus();
            })

            $('#btnAddModal').click(function() {
                $("#txtRestaurant").val("");
                googleApiService.setNearbyFood();
                var isGoodRestaurant = shouldAddGoodRestaurant();
                isGoodRestaurant
                    ? $("#modalTitle").html("Add a <span class=\"goodRestaurant\">good</span> restaurant")
                    : $("#modalTitle").html("Now, add a <span class=\"badRestaurant\">bad</span> restaurant");
            });
            
            $('#btnAddRestaurant').click(function () {
                var isGoodRestaurant = shouldAddGoodRestaurant();
                addRestaurant($('#txtRestaurant').val(), isGoodRestaurant);
            });

            $('#btnSpin').click(function () {
                $("#txtContent").text("Meal");
                $("#fullScreenDisplay").modal('show');
                setTimeout(function() {
                    $("#txtContent").text("Wheel");
                    setTimeout(function () {
                        $("#txtContent").text("of Destiny");
                        setTimeout(function() {
                            $("#fullScreenDisplay").modal('hide');
                            showScreen("home", "wheel");
                            var width = 667;
                            var height = 375;
                            wheel.spin(($(window).width() < width) ? $(window).width() : width, ($(window).height() < height) ? $(window).height() : height, onStoppedSpinning);
                            playAudio('Applause1.wav');
                        }, 1000);
                    }, 1000);
                }, 1000);
            });

            $('.btnBackToHome').click(function () {
                Reset();
                showScreen("wheel", "home");
                if (isDevice()) {
                    adMobService.showAdInterstitial();
                }
            });

            $('.modal-vcenter').on('show.bs.modal', function (e) {
                centerModals($(this));
            });
            $(window).on('resize', centerModals);

            playAudio('Audacity-NoName.mp3', true);
        }, 2000);

        function loadAllAudio() {
            window.plugins.NativeAudio.preloadComplex('Audacity-NoName.mp3', 'audio/Audacity-NoName.mp3', .5, 1, 0, function (msg) {
            }, function (msg) {
                console.log('error: ' + msg);
            });
            window.plugins.NativeAudio.preloadSimple('Applause1.wav', 'audio/Applause1.wav', function (msg) {
            }, function (msg) {
                console.log('error: ' + msg);
            });
            window.plugins.NativeAudio.preloadSimple('ATone.wav', 'audio/ATone.wav', function (msg) {
            }, function (msg) {
                console.log('error: ' + msg);
            });
            window.plugins.NativeAudio.preloadSimple('WhatYouEatin.wav', 'audio/WhatYouEatin.wav', function (msg) {
            }, function (msg) {
                console.log('error: ' + msg);
            });
        }

        function Reset() {
            $(".winning").text("");
            $("#container").html("");
            $("#btnBackToHomeWheel").removeClass("moveUpBackToHome");
            wheel.reset();
        }

        function onStoppedSpinning(wedge) {
            var modalText, modalTitle;
            if (wedge[0].isGoodRestaurant) {
                modalText = "You're going to ";
                modalTitle = "Yay!";
                playAudio('ATone.wav');
            }else{
                modalText = "Oh no!  You're going to ";
                modalTitle = "Oh no!";
                playAudio('WhatYouEatin.wav');
            }
            $
            $(".winning").text(modalText + wedge[0].text);
            $("#destinationModalTitle").text(modalTitle);
            $('#destinationModal').modal('show');
            $("#btnBackToHomeWheel").addClass("moveUpBackToHome");
        }

        function showScreen(previousScreenName, newScreenName) {
            $("#" + previousScreenName + "Screen").hide();
            $("#" + newScreenName + "Screen").show();
        }

        function shouldAddGoodRestaurant() {
            var isGoodRestaurant = true;
            if (wheel.wedges.length >= 5 && this.app.badRestaurants <= 0) {
                return false;
            }

            return true;
        }

        function addRestaurant(text, isGoodRestaurant) {
            if (text) {
                var textClass = "";
                if (isGoodRestaurant) {
                    this.app.goodRestaurants++;
                    textClass = "goodRestaurant";
                } else {
                    this.app.badRestaurants++;
                    textClass = "badRestaurant";
                }

                wheel.addWedge(text, isGoodRestaurant);
                $("#lstRestaurants").append("<li class=\"" + textClass + "\"><h6 style=\"display:inline;\">" + text + "</h6> <button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"app.deleteRestaurant('" + text.replace("'", "*") + "', " + isGoodRestaurant + ");\">&#45;</button></li>");

                if (wheel.wedges.length >= 6) {
                    $("#btnAddModal").hide();
                    $("#btnSpin").show();
                }
            }
        }

        function centerModals($element) {
            var $modals;
            if ($element.length) {
                $modals = $element;
            } else {
                $modals = $('.modal-vcenter:visible');
            }
            $modals.each(function (i) {
                var $clone = $(this).clone().css('display', 'block').appendTo('body');
                var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
                top = top > 0 ? top : 0;
                $clone.remove();
                $(this).find('.modal-content').css("margin-top", top);
            });
        }

        function playAudio(filename, isBackgroundMusic) {
            if (isDevice()) {
                var path = window.location.pathname;
                var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
                var devicePlatform = device.platform;
                if (isBackgroundMusic) {
                    window.plugins.NativeAudio.preloadComplex( filename, 'audio/' + filename, .5, 1, 0, function(msg){
                    }, function(msg){
                        console.log( 'error: ' + msg );
                    });
                    window.plugins.NativeAudio.loop(filename);
                }
                else {
                    window.plugins.NativeAudio.preloadSimple(filename, 'audio/' + filename, function (msg) {
                    }, function (msg) {
                        console.log('error: ' + msg);
                    });
                    window.plugins.NativeAudio.play(filename);
                }
            }
        }

        function isDevice() {
            return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        }
    },
    deleteRestaurant: function (text, isGoodRestaurant) {
        text = text.replace("*", "'");
        if (isGoodRestaurant) {
            this.goodRestaurants--;
        } else {
            this.badRestaurants--;
        }
        wheel.removeWedge(text);
        $("li:contains('" + text + "'):first").remove();
        $("#btnAddModal").show();
        $("#btnSpin").hide();
    }
};
