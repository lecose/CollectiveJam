
class Boid {
    constructor(x_dim, y_dim, margin, max_speed, min_speed, turnfactor,
                avoid_factor, matching_factor, centering_factor,
                protected_range, visible_range){
        this.x_dim = x_dim;
        this.y_dim = y_dim;
        this.margin = margin;
        this.x_pos = Math.floor(Math.random() * (x_dim - margin) + margin);
        this.y_pos = Math.floor(Math.random() * (y_dim - margin) + margin);
        this.x_vel = Math.random() * max_speed + min_speed;
        this.y_vel = Math.random() * max_speed + min_speed;
        this.max_speed = max_speed;
        this.min_speed = min_speed;
        this.turnfactor = turnfactor;
        this.avoid_factor = avoid_factor;
        this.matching_factor = matching_factor;
        this.centering_factor = centering_factor;
        this.close_dx = 0;
        this.close_dy = 0;
        this.xvel_avg = 0;
        this.yvel_avg = 0;
        this.num_neighbors = 0;
        this.xpos_avg = 0;
        this.ypos_avg = 0;
        this.protected_range = protected_range;
        this.visible_range = visible_range;
    }

    update(other_boids){

        this.close_dx = 0;
        this.close_dy = 0;
        this.xvel_avg = 0;
        this.yvel_avg = 0;
        this.num_neighbors = 0;
        this.xpos_avg = 0;
        this.ypos_avg = 0;

        for(let i = 0; i < other_boids.length; i++)
        {
            let dist = this.manhattan_dist(other_boids[i]);
            if(dist < this.protected_range)
            {
                this.check_separation(other_boids[i]);
            }
            if(dist < this.visible_range)
            {
                this.check_alignment(other_boids[i]);
                this.check_cohesion(other_boids[i]);
            }
        }
        this.xvel_avg /= this.num_neighbors;
        this.yvel_avg /= this.num_neighbors;
        this.xpos_avg /= this.num_neighbors;
        this.ypos_avg /= this.num_neighbors;

        // separation
        this.x_vel += this.close_dx * this.avoid_factor;
        this.y_vel += this.close_dy * this.avoid_factor;

        if(this.num_neighbors > 0)
        {
            // alignment
            this.x_vel += (this.xvel_avg - this.x_vel) * this.matching_factor;
            this.y_vel += (this.yvel_avg - this.y_vel) * this.matching_factor;

            // cohesion
            this.x_vel += (this.xpos_avg - this.x_pos) * self.centering_factor;
            this.y_vel += (this.ypos_avg - this.y_pos) * self.centering_factor;
        }

        // turn back at margin
        if(this.x_pos < this.margin)
        {
            this.x_vel += this.turnfactor;
        }
        else if(this.x_pos > this.x_dim - this.margin)
        {
            this.x_vel -= this.turnfactor;
        }

        if(this.y_pos < this.margin)
        {
            this.y_vel += this.turnfactor;
        }
        else if(this.y_pos > this.y_dim - this.margin)
        {
            this.y_vel -= this.turnfactor;
        }

        // limit boids velocity
        let speed = Math.sqrt(this.x_vel**2 + this.y_vel**2)
        if(speed > this.max_speed)
        {
            this.x_vel = (this.x_vel / speed) * this.max_speed;
            this.y_vel = (this.y_vel / speed) * this.max_speed;
        }
        if(speed < this.min_speed)
        {
            this.x_vel = (this.x_vel / speed) * this.min_speed;
            this.y_vel = (this.y_vel / speed) * this.min_speed;
        }

        // update position
        this.x_pos += Math.floor(this.x_vel);
        this.y_pos += Math.floor(this.y_vel);
    }

    check_separation(other_boid)
    {
        this.close_dx += this.x_pos - other_boid.x_pos;
        this.close_dy += this.y_pos - other_boid.y_pos;
    }

    check_alignment(other_boid)
    {
        this.xvel_avg += other_boid.x_vel;
        this.yvel_avg += other_boid.y_vel;
    }

    check_cohesion(other_boid)
    {
        this.xpos_avg += other_boid.x_pos;
        this.ypos_avg += other_boid.y_pos;
    }

    manhattan_dist(othe_boid)
    {
        return Math.abs(this.x_pos - othe_boid.x_pos) +
                Math.abs(this.y_pos - othe_boid.y_pos);
    }
}



function update_flock(boids)
{
    for(let i = 0; i < boids.length; i++)
    {
        // console.log("Boid " + i + ": (" + boids[i].x_pos + ", " + boids[i].y_pos + ")");
        const other_boids = boids.slice();
        boids[i].update(other_boids.splice(i, 1));
    }
}

function get_positions(boids)
{
    pos_x = [];
    pos_y = [];
    for(let i = 0; i < boids.length; i++)
    {
        pos_x[i] = boids[i].x_pos;
        pos_y[i] = boids[i].y_pos;
    }
    return [pos_x, pos_y];
}

function run_simulation()
{
    positions = get_positions(boids);
    theChuck.setIntArray("x_pos", positions[0]);
    theChuck.setIntArray("y_pos", positions[1]);
    
    for(let i = 0; i < 10; i++)
    {
        // theChuck.getIntArray("x_pos").then((value) => console.log("X: " + value));
        // theChuck.getIntArray("y_pos").then((value) => console.log("Y: " + value));
        update_flock(boids);
        positions = get_positions(boids);
        theChuck.setIntArray("x_pos", positions[0]);
        theChuck.setIntArray("y_pos", positions[1]);
    }
}


x_dim = 1000;
y_dim = 700;
margin = 50

max_speed = 10;
min_speed = 0;
avoid_factor = 0.06;
matching_factor = 0.2;
centering_factor = 0.003;
turnfactor = 2.5;
protected_range = 50;
visible_range = 70;

num_boids = 10;
var boids = [];
for(let i = 0; i < num_boids; i++)
{
    boids[i] = new Boid(x_dim, y_dim, margin, max_speed, min_speed, turnfactor,
        avoid_factor, matching_factor, centering_factor, protected_range, visible_range);
}