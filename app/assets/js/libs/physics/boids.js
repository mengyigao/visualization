var Boid = function() {

    // depends on Vector3 
    var vector = new Vector3(),
        _acceleration, _width = 500,
        _height = 500,
        _depth = 200,
        _goal, _neighborhoodRadius = 100,
        _maxSpeed = 4,
        _maxSteerForce = 0.1,
        _avoidWalls = false;

    this.coeff_alignment = 1,
    this.coeff_cohesion = 1,
    this.coeff_separation = 1;


    this.position = new Vector3();
    this.velocity = new Vector3();
    _acceleration = new Vector3();

    this.setGoal = function(target) {
        _goal = target;
    }

    this.setAvoidWalls = function(value) {
        _avoidWalls = value;
    }

    this.setWorldSize = function(width, height, depth) {
        _width = width;
        _height = height;
        _depth = depth;
    }

    this.position.x = Math.random() * 400 - 200;
    this.position.y = Math.random() * 400 - 200;
    this.position.z = Math.random() * 400 - 200;
    this.velocity.x = Math.random() * 2 - 1;
    this.velocity.y = Math.random() * 2 - 1;
    this.velocity.z = Math.random() * 2 - 1;
    this.setAvoidWalls(true);
    this.setWorldSize(500, 500, 400);

    this.run = function(boids) {

        if (_avoidWalls) {

            vector.set(-_width, this.position.y, this.position.z);
            vector = this.avoid(vector);
            vector.multiplyScalar(5);
            _acceleration.add(vector);

            vector.set(_width, this.position.y, this.position.z);
            vector = this.avoid(vector);
            vector.multiplyScalar(5);
            _acceleration.add(vector);

            vector.set(this.position.x, -_height, this.position.z);
            vector = this.avoid(vector);
            vector.multiplyScalar(5);
            _acceleration.add(vector);

            vector.set(this.position.x, _height, this.position.z);
            vector = this.avoid(vector);
            vector.multiplyScalar(5);
            _acceleration.add(vector);

            vector.set(this.position.x, this.position.y, -_depth);
            vector = this.avoid(vector);
            vector.multiplyScalar(5);
            _acceleration.add(vector);

            vector.set(this.position.x, this.position.y, _depth);
            vector = this.avoid(vector);
            vector.multiplyScalar(5);
            _acceleration.add(vector);
        }
        /* else {
                    this.checkBounds();
                }
                */

        if (Math.random() > 0.5) {
            this.flock(boids);
        }
        this.move();
    }

    this.flock = function(boids) {
        if (_goal) {
            _acceleration.add(this.reach(_goal, 0.005));
        }

        _acceleration.add(this.alignment(boids).multiplyScalar(this.coeff_alignment));
        _acceleration.add(this.cohesion(boids).multiplyScalar(this.coeff_cohesion));
        _acceleration.add(this.separation(boids).multiplyScalar(this.coeff_separation));
    }

    this.move = function() {
        this.velocity.add(_acceleration);

        var l = this.velocity.length();
        if (l > _maxSpeed) {
            this.velocity.divideScalar(l / _maxSpeed);
        }

        this.position.add(this.velocity);
        _acceleration.set(0, 0, 0);
    }

    this.checkBounds = function() {
        if (this.position.x > _width) this.position.x = -_width;
        if (this.position.x < -_width) this.position.x = _width;
        if (this.position.y > _height) this.position.y = -_height;
        if (this.position.y < -_height) this.position.y = _height;
        if (this.position.z > _depth) this.position.z = -_depth;
        if (this.position.z < -_depth) this.position.z = _depth;
    }

    this.avoid = function(target) {
        var steer = new Vector3();
        steer.copy(this.position);
        steer.sub(target);
        steer.multiplyScalar(1 / this.position.distanceToSquared(target));
        return steer;
    }

    this.repulse = function(target) {
        var distance = this.position.distanceTo(target);

        if (distance < 150) {
            var steer = new Vector3();
            steer.subVectors(this.position, target);
            steer.multiplyScalar(0.5 / distance);
            _acceleration.add(steer);
        }
    }

    this.reach = function(target, amount) {
        var steer = new Vector3();
        steer.subVectors(target, this.position);
        steer.multiplyScalar(amount);
        return steer;
    }

    this.alignment = function(boids) {
        var boid, velSum = new Vector3(),
            count = 0;

        for (var i = 0, il = boids.length; i < il; i++) {
            if (Math.random() > 0.6) continue;
            boid = boids[i];
            distance = boid.position.distanceTo(this.position);

            if (distance > 0 && distance <= _neighborhoodRadius) {
                velSum.add(boid.velocity);
                count++;
            }
        }

        if (count > 0) {
            velSum.divideScalar(count);
            var l = velSum.length();
            if (l > _maxSteerForce) {
                velSum.divideScalar(l / _maxSteerForce);
            }
        }

        return velSum;
    }

    this.cohesion = function(boids) {

        var boid, distance,
            posSum = new Vector3(),
            steer = new Vector3(),
            count = 0;

        for (var i = 0, il = boids.length; i < il; i++) {

            if (Math.random() > 0.6) continue;

            boid = boids[i];
            distance = boid.position.distanceTo(this.position);

            if (distance > 0 && distance <= _neighborhoodRadius) {
                posSum.add(boid.position);
                count++;
            }

        }

        if (count > 0) {
            posSum.divideScalar(count);
        }

        steer.subVectors(posSum, this.position);

        var l = steer.length();

        if (l > _maxSteerForce) {
            steer.divideScalar(l / _maxSteerForce);
        }

        return steer;
    }

    this.separation = function(boids) {
        var boid, distance,
            posSum = new Vector3(),
            repulse = new Vector3();

        for (var i = 0, il = boids.length; i < il; i++) {
            if (Math.random() > 0.6) continue;

            boid = boids[i];
            distance = boid.position.distanceTo(this.position);

            if (distance > 0 && distance <= _neighborhoodRadius) {
                repulse.subVectors(this.position, boid.position);
                repulse.normalize();
                repulse.divideScalar(distance);
                posSum.add(repulse);
            }
        }
        return posSum;
    }

    // copy from boids_prototypes
    this.set_parameters = function() {
    this.radius = Math.random() * 40;

    /**
        * No Action Required
        * these parameters are used in calulating the color as a function of momentum
    **/

    this.max_momentum = 0;
    this.min_momentum = 4;
    this.range_momentum = 0;
}

this.create_geometry = function() {
    var size = Math.random() * 30 + 20
    this.geometry = new THREE.BoxGeometry( size, size, size );


}

this.create_material = function() {
    // assign a random color from HSL space
    this.color = new THREE.Color(); // http://threejs.org/docs/#Reference/Math/Color
    this.color.setHSL(Math.random(), .85, .5);

    this.material = new THREE.MeshPhongMaterial({
                "color": this.color,
                "specular": 0x333333,
                "shininess": .9,
                "transparent": true,
                "opacity": 0.75
            });


}

this.create_mesh = function() {


    this.mesh = new THREE.Mesh(
        this.geometry,
        this.material
    );

    this.mesh.position.set(this.position.x,this.position.y,this.position.z);

}

this.init_mesh_obj = function() {
    this.create_geometry();
    this.create_material();
    this.create_mesh();
}

this.update_mesh = function() {


    this.mesh.position.set(this.position.x,this.position.y,this.position.z);
    var momentum = this.velocity.length() * this.radius;
    if( momentum > this.max_momentum){ this.max_momentum = momentum; this.range_momentum = this.max_momentum - this.min_momentum; }
    if( momentum < this.min_momentum){ this.min_momentum = momentum; this.range_momentum = this.max_momentum - this.min_momentum; }
    this.mesh.material.color.setHSL( .8, momentum/this.range_momentum * 0.8, momentum/this.range_momentum * 0.5);
}
}
