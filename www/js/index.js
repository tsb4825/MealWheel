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
        setTimeout(function () {
            navigator.splashscreen.hide();
            googleApiService.autoComplete();
            //for (var i = 0; i < 6; i++) {
            addRestaurant("Kentucky Fried Chicken", true);
            addRestaurant("Chicken Express", true);
            addRestaurant("Mc Donalds", true);
            addRestaurant("Jack in the Box", true);
            addRestaurant("Smash Burger", true);
            addRestaurant("Chinese Super Buffet", false);
            //}

            $('#addWedgeModal').on('shown.bs.modal', function () {
                $('#txtRestaurant').focus();
            })

            $('#btnAddModal').click(function() {
                $("#txtRestaurant").val("");
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
                            $("#spin")[0].play();
                        }, 1000);
                    }, 1000);
                }, 1000);
            });

            $('#btnBackToHome').click(function () {
                Reset();
                showScreen("wheel", "home");
            });

            $('.modal-vcenter').on('show.bs.modal', function (e) {
                centerModals($(this));
            });
            $(window).on('resize', centerModals);
        }, 2000);

        function Reset() {
            $("#txtWinner").text("");
            $("#container").html("");
            wheel.reset();
        }

        function onStoppedSpinning(wedge) {
            var modalText, modalTitle;
            if (wedge[0].isGoodRestaurant) {
                modalText = "You're going to ";
                modalTitle = "Yay!";
                $("#win")[0].play();
            }else{
                modalText = "Oh no!  You're going to ";
                modalTitle = "Oh no!";
                $("#lose")[0].play();
            }
            $
            $("#txtWinner").text(modalText + wedge[0].text);
            $("#destinationModalTitle").text(modalTitle);
            $('#destinationModal').modal('show');
        }

        function showScreen(previousScreenName, newScreenName) {
            $("#" + previousScreenName + "Screen").hide();
            $("#" + newScreenName + "Screen").show();
        }

        function shouldAddGoodRestaurant() {
            var isGoodRestaurant = true;
            if (wheel.wedges.length >= 5) {
                return false;
            }

            return true;
        }

        function addRestaurant(text, isGoodRestaurant) {
            var textClass = "";
            if (isGoodRestaurant) {
                this.goodRestaurants++;
                textClass = "goodRestaurant";
            } else {
                this.badRestaurants++;
                textClass = "badRestaurant";
            }

            wheel.addWedge(text, isGoodRestaurant);
            $("#lstRestaurants").append("<li class=\"" + textClass + "\">" + text + " <button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"app.deleteRestaurant('" + text + "', " + isGoodRestaurant + ");\">&#45;</button></li>");

            if (wheel.wedges.length >= 6) {
                $("#btnAddModal").hide();
                $("#btnSpin").show();
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
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

    },
    deleteRestaurant: function (text, isGoodRestaurant) {
        if (isGoodRestaurant) {
            this.goodRestaurants--;
        } else {
            this.badRestaurants--;
        }
        wheel.removeWedge(text);
        $("li:contains('" + text + "'):first").remove();
        $("#btnAddRestaurant").show();
        $("#btnSpin").hide();
    },
    goodRestaurants: 0,
    badRestaurants: 0
};
