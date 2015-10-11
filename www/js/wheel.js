// JavaScript source code
var wheel = {
    angularVelocity: 6,
    angularVelocities: [],
    controlled: false,
    angularFriction: 0.2,
    target: null, 
    activeWedge: null, 
    stage: null, 
    layer: null, 
    wheel: null, 
    pointer: null,
    wedges: [],
    addWedge: function(name) {
        this.wedges.push(name);
    },
    removeWedge: function(name) {
        var index = this.wedges.indexOf(name);
        if (index > -1) {
            this.wedges.splice(index, 1);
        }
    },
    spin: function () {
        var self = this;
        init();

        var anim = new Kinetic.Animation(animate, self.layer);
        anim.start();

        function init() {
            self.stage = new Kinetic.Stage({
                container: 'container',
                width: 578,
                height: 200
            });
            self.layer = new Kinetic.Layer();
            self.wheel = new Kinetic.Group({
                x: self.stage.getWidth() / 2,
                y: 410
            });

            for (var n = 0; n < self.wedges.length; n++) {
                addWedgeToWheel(n, self.wedges[n].name);
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

            // bind events
            bind();

            function addWedgeToWheel(n, text) {
                var s = getRandomColor();
                var reward = getRandomReward();
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
                    text: reward,
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
                            x: 380,
                            y: 30
                        });

                        wedge.add(cachedText);
                        self.layer.draw();
                    }
                });

                wedge.startRotation = wedge.getRotation();

                self.wheel.add(wedge);

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

                function getRandomReward() {
                    var mainDigit = Math.round(Math.random() * 9);
                    return mainDigit + '\n0\n0';
                }
            }

            function bind() {
                self.wheel.on('mousedown', function (evt) {
                    self.angularVelocity = 0;
                    self.controlled = true;
                    self.target = evt.targetNode;
                });
                // add listeners to container
                document.body.addEventListener('mouseup', function() {
                    self.controlled = false;
                    self.angularVelocity = getAverageAngularVelocity() * 5;

                    if (self.angularVelocity > 20) {
                        self.angularVelocity = 20;
                    } else if (self.angularVelocity < -20) {
                        self.angularVelocity = -20;
                    }

                    self.angularVelocities = [];
                }, false);

                document.body.addEventListener('mousemove', function(evt) {
                    var mousePos = self.stage.getMousePosition();
                    if (self.controlled && mousePos && self.target) {
                        var x = mousePos.x - self.wheel.getX();
                        var y = mousePos.y - self.wheel.getY();
                        var atan = Math.atan(y / x);
                        var rotation = x >= 0 ? atan : atan + Math.PI;
                        var targetGroup = self.target.getParent();

                        self.wheel.setRotation(rotation - targetGroup.startRotation - (self.target.getAngle() / 2));
                    }
                }, false);

                function getAverageAngularVelocity() {
                    var total = 0;
                    var len = self.angularVelocities.length;

                    if (len === 0) {
                        return 0;
                    }

                    for (var n = 0; n < len; n++) {
                        total += self.angularVelocities[n];
                    }

                    return total / len;
                }
            }
        }

        function animate(frame) {
            // handle wheel spin
            var angularVelocityChange = self.angularVelocity * frame.timeDiff * (1 - self.angularFriction) / 1000;
            self.angularVelocity -= angularVelocityChange;

            if (self.controlled) {
                if (self.angularVelocities.length > 10) {
                    self.angularVelocities.shift();
                }

                self.angularVelocities.push((self.wheel.getRotation() - lastRotation) * 1000 / frame.timeDiff);
            } else {
                self.wheel.rotate(frame.timeDiff * self.angularVelocity / 1000);
            }
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
        }
    }
};