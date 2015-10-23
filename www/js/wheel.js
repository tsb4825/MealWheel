// JavaScript source code
var wheel = {
    angularVelocity: 6,
    angularFriction: 0.22,
    activeWedge: null, 
    stage: null, 
    layer: null, 
    wheel: null, 
    pointer: null,
    wedges: [],
    reset: function () {
        this.angularVelocity = 6;
        this.activeWedge = null;
        this.stage = null;
        this.layer = null;
        this.wheel = null;
        this.pointer = null;
    },
    addWedge: function (name, isGoodRestaurant) {
        this.wedges.push({ text: name, isGoodRestaurant: isGoodRestaurant });
    },
    removeWedge: function(name) {
        var index = this.wedges.indexOf(name);
        if (index > -1) {
            this.wedges.splice(index, 1);
        }
    },
    spin: function (width, height, callback) {
        var self = this;
        init();

        var hasCalledBack = false;
        var anim = new Kinetic.Animation(animate, self.layer);
        anim.start();

        function init() {
            self.stage = new Kinetic.Stage({
                container: 'container',
                width: width - 40,
                height: height - 125
            });
            self.layer = new Kinetic.Layer();
            self.wheel = new Kinetic.Group({
                x: self.stage.getWidth() / 2,
                y: 410
            });

            for (var n = 0; n < self.wedges.length; n++) {
                addWedgeToWheel(n, self.wedges[n].text);
            }
            self.pointer = new Kinetic.Wedge({
                fillRadialGradientStartPoint: 0,
                fillRadialGradientStartRadius: 0,
                fillRadialGradientEndPoint: 0,
                fillRadialGradientEndRadius: 30,
                fillRadialGradientColorStops: [0, 'white', 1, 'red'],
                stroke: 'white',
                strokeWidth: 2,
                lineJoin: 'round',
                angleDeg: 30,
                radius: 30,
                x: self.stage.getWidth() / 2,
                y: 30,
                rotationDeg: -105,
                shadowColor: 'black',
                shadowOffset: 3,
                shadowBlur: 2,
                shadowOpacity: 0.5
            });

            // add components to the stage
            self.layer.add(self.wheel);
            self.layer.add(self.pointer);
            self.stage.add(self.layer);

            function addWedgeToWheel(n, text) {
                var s = getRandomColor();
                var r = s[0];
                var g = s[1];
                var b = s[2];
                var angle = 2 * Math.PI / self.wedges.length;

                var endColor = 'rgb(' + r + ',' + g + ',' + b + ')';
                r += 100;
                g += 100;
                b += 100;

                var startColor = 'rgb(' + r + ',' + g + ',' + b + ')';

                var wedge = new Kinetic.Group({
                    rotation: 2 * n * Math.PI / self.wedges.length,
                });

                var wedgeBackground = new Kinetic.Wedge({
                    radius: 400,
                    angle: angle,
                    fillRadialGradientStartPoint: 0,
                    fillRadialGradientStartRadius: 0,
                    fillRadialGradientEndPoint: 0,
                    fillRadialGradientEndRadius: 400,
                    fillRadialGradientColorStops: [0, startColor, 1, endColor],
                    fill: '#64e9f8',
                    fillPriority: 'radial-gradient',
                    stroke: '#ccc',
                    strokeWidth: 2
                });

                wedge.add(wedgeBackground);

                var text = new Kinetic.Text({
                    text: formatText(text),
                    fontFamily: 'Calibri',
                    fontSize: 50,
                    fill: 'white',
                    align: 'center',
                    stroke: 'yellow',
                    strokeWidth: 1

                });

                // cache text as an image to improve performance
                text.toImage({
                    width: text.getWidth(),
                    height: text.getHeight(),
                    callback: function (img) {
                        var cachedText = new Kinetic.Image({
                            image: img,
                            listening: false,
                            rotation: (Math.PI + angle) / 2,
                            x: 350,
                            y: 185
                        });

                        wedge.add(cachedText);
                        self.layer.draw();
                    }
                });

                wedge.startRotation = wedge.getRotation();

                self.wheel.add(wedge);
                self.wedges[n].id = wedge.children[0]._id;

                function formatText(text) {
                    var truncatedText = text;
                    if (text.length > 5) {
                        var matches = text.match(/\b(\w)/g);
                        if (matches.length > 0) {
                            if (matches.length <= 4) {
                                trucatedText = matches.join('');
                            } else {
                                trucatedText = matches.slice(0, 3).join('');
                            }
                        } else {
                            trucatedText = text.slice(0, 3);
                        }
                    }

                    var newString = "";
                    for (var index = 0; index < trucatedText.length; index++)
                    {
                        newString += trucatedText[index] + "\n";
                    }
                    return newString;
                }

                function getRandomColor() {
                    var r = 100 + Math.round(Math.random() * 55);
                    var g = 100 + Math.round(Math.random() * 55);
                    var b = 100 + Math.round(Math.random() * 55);
                    var color = [r, g, b];
                    color = purifyColor(color);
                    color = purifyColor(color);

                    return color;
                }

                function purifyColor(color) {
                    var randIndex = Math.round(Math.random() * 3);
                    color[randIndex] = 0;
                    return color;
                }
            }
        }

        function animate(frame) {
            // handle wheel spin
            var angularVelocityChange = self.angularVelocity * frame.timeDiff * (1 - self.angularFriction) / 1000;
            self.angularVelocity -= angularVelocityChange;

            self.wheel.rotate(frame.timeDiff * self.angularVelocity / 1000);
            
            lastRotation = self.wheel.getRotation();

            // activate / deactivate wedges based on point intersection
            var intersection = self.stage.getIntersection({
                x: self.stage.getWidth() / 2,
                y: 100
            });

            if (intersection) {
                var shape = intersection.shape;

                if (shape && (!self.activeWedge || (shape._id !== self.activeWedge._id))) {
                    self.pointer.setY(20);
                    self.pointer.transitionTo({
                        y: 30,
                        easing: 'elastic-ease-out',
                        duration: 0.3
                    });

                    if (self.activeWedge) {
                        self.activeWedge.setFillPriority('radial-gradient');
                    }
                    shape.setFillPriority('fill');
                    self.activeWedge = shape;
                }
            }

            if (self.angularVelocity <= .015 && !hasCalledBack) {
                anim.stop();
                callback(self.wedges.filter(function (value) {
                    return value.id == self.activeWedge._id;
                }));
                hasCalledBack = true;
            }
        }
    }
};