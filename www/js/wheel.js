// JavaScript source code
var wheel = {
    angularVelocity: 6,
    angularVelocities: [],
    lastRotations: 0,
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
        init();

        var anim = new Kinetic.Animation(animate, layer);
        anim.start();

        function init() {
            stage = new Kinetic.Stage({
                container: 'container',
                width: 578,
                height: 200
            });
            layer = new Kinetic.Layer();
            wheel = new Kinetic.Group({
                x: stage.getWidth() / 2,
                y: 410
            });

            for (var n = 0; n < this.wedges.count; n++) {
                addWedgeToWheel(n, this.wedges[n].name);
            }
            pointer = new Kinetic.Wedge({
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
                x: stage.getWidth() / 2,
                y: 30,
                rotationDeg: -105,
                shadowColor: 'black',
                shadowOffset: 3,
                shadowBlur: 2,
                shadowOpacity: 0.5
            });

            // add components to the stage
            layer.add(wheel);
            layer.add(pointer);
            stage.add(layer);

            // bind events
            bind();

            function bind() {
                wheel.on('mousedown', function(evt) {
                    angularVelocity = 0;
                    controlled = true;
                    target = evt.targetNode;
                });
                // add listeners to container
                document.body.addEventListener('mouseup', function() {
                    controlled = false;
                    angularVelocity = getAverageAngularVelocity() * 5;

                    if (angularVelocity > 20) {
                        angularVelocity = 20;
                    } else if (angularVelocity < -20) {
                        angularVelocity = -20;
                    }

                    angularVelocities = [];
                }, false);

                document.body.addEventListener('mousemove', function(evt) {
                    var mousePos = stage.getMousePosition();
                    if (controlled && mousePos && target) {
                        var x = mousePos.x - wheel.getX();
                        var y = mousePos.y - wheel.getY();
                        var atan = Math.atan(y / x);
                        var rotation = x >= 0 ? atan : atan + Math.PI;
                        var targetGroup = target.getParent();

                        wheel.setRotation(rotation - targetGroup.startRotation - (target.getAngle() / 2));
                    }
                }, false);

                function getAverageAngularVelocity() {
                    var total = 0;
                    var len = angularVelocities.length;

                    if (len === 0) {
                        return 0;
                    }

                    for (var n = 0; n < len; n++) {
                        total += angularVelocities[n];
                    }

                    return total / len;
                }

                function animate(frame) {
                    // handle wheel spin
                    var angularVelocityChange = angularVelocity * frame.timeDiff * (1 - angularFriction) / 1000;
                    angularVelocity -= angularVelocityChange;

                    if (controlled) {
                        if (angularVelocities.length > 10) {
                            angularVelocities.shift();
                        }

                        angularVelocities.push((wheel.getRotation() - lastRotation) * 1000 / frame.timeDiff);
                    } else {
                        wheel.rotate(frame.timeDiff * angularVelocity / 1000);
                    }
                    lastRotation = wheel.getRotation();

                    // activate / deactivate wedges based on point intersection
                    var intersection = stage.getIntersection({
                        x: stage.getWidth() / 2,
                        y: 100
                    });

                    if (intersection) {
                        var shape = intersection.shape;

                        if (shape && (!activeWedge || (shape._id !== activeWedge._id))) {
                            pointer.setY(20);
                            pointer.transitionTo({
                                y: 30,
                                easing: 'elastic-ease-out',
                                duration: 0.3
                            });

                            if (activeWedge) {
                                activeWedge.setFillPriority('radial-gradient');
                            }
                            shape.setFillPriority('fill');
                            activeWedge = shape;
                        }
                    }
                }

                function addWedgeToWheel(n, text) {
                    var s = getRandomColor();
                    var reward = getRandomReward();
                    var r = s[0];
                    var g = s[1];
                    var b = s[2];
                    var angle = 2 * Math.PI / this.wedges.count;

                    var endColor = 'rgb(' + r + ',' + g + ',' + b + ')';
                    r += 100;
                    g += 100;
                    b += 100;

                    var startColor = 'rgb(' + r + ',' + g + ',' + b + ')';

                    var wedge = new Kinetic.Group({
                        rotation: 2 * n * Math.PI / this.wedges.count,
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
                        callback: function(img) {
                            var cachedText = new Kinetic.Image({
                                image: img,
                                listening: false,
                                rotation: (Math.PI + angle) / 2,
                                x: 380,
                                y: 30
                            });

                            wedge.add(cachedText);
                            layer.draw();
                        }
                    });

                    wedge.startRotation = wedge.getRotation();

                    wheel.add(wedge);

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
            }
        }
    }
};