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
            //navigator.splashscreen.hide();

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
        }, 2000);

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

            wheel.addWedge(text);
            $("#lstRestaurants").append("<li class=\"" + textClass + "\">" + text + " <button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"app.deleteRestaurant('" + text + "', " + isGoodRestaurant + ");\">&#45;</button></li>");

            if (wheel.wedges.length >= 6) {
                $("#btnAddRestaurant").hide();
                $("#btnSpin").show();
            }
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
