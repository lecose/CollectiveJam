
class Boid {
    constructor(x_dim, y_dim, margin, max_speed, min_speed, turnfactor,
                avoid_factor, matching_factor, centering_factor,
                protected_range, visible_range, interaction_range, interaction_factor){
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
        this.interaction_range = interaction_range;
        this.interaction_factor = interaction_factor;
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
            let dist = this.manhattan_dist(other_boids[i].x_pos, other_boids[i].y_pos);
            if(dist < this.protected_range)
            {
                this.check_separation(other_boids[i]);
            }
            if(dist < this.visible_range)
            {
                this.num_neighbors += 1;
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

        // interaction
        this.check_interaction();

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

    check_interaction()
    {
        var dist = this.manhattan_dist(mousePos.x, mousePos.y);
        if(dist < this.interaction_range)
        {
            this.x_vel += (mousePos.x - this.x_pos) * self.interaction_factor;
            this.y_vel += (mousePos.y - this.y_pos) * self.interaction_factor;
        }
    }

    manhattan_dist(other_x, other_y)
    {
        return Math.abs(this.x_pos - other_x) +
                Math.abs(this.y_pos - other_y);
    }
}



function update_flock(boids)
{
    for(let i = 0; i < boids.length; i++)
    {
        boids[i].update(boids.toSpliced(i, 1));
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


function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
}

function run_simulation()
{
    theChuck.setInt("num_boids", num_boids);
    theChuck.setInt("width", width);
    theChuck.setInt("height", height);

    update_flock(boids);
    positions = get_positions(boids);

    // update chuck
    theChuck.setIntArray("x_pos", positions[0]);
    theChuck.setIntArray("y_pos", positions[1]);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgb(0, 255, 0)";
    
    for(let i = 0; i < positions[0].length; i++)
    {
        ctx.beginPath();
        ctx.arc(positions[0][i], positions[1][i], 10, degToRad(0), degToRad(360), false);
        ctx.fill();
    }

    if(!pause)
    {
        window.requestAnimationFrame(run_simulation);
    }
}

// visualization
const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight - 100);

const ctx = canvas.getContext("2d");

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(0, 0, width, height);

margin = 50

max_speed = 5;
min_speed = 1;
avoid_factor = 0.06;
matching_factor = 0.2;
centering_factor = 0.003;
turnfactor = 2;
protected_range = 30;
visible_range = 60;

interaction_range = 500;
interaction_factor = 0.001;

num_boids = 50;
var boids = [];
for(let i = 0; i < num_boids; i++)
{
    boids[i] = new Boid(width, height, margin, max_speed, min_speed, turnfactor,
        avoid_factor, matching_factor, centering_factor, protected_range, visible_range, 
        interaction_range, interaction_factor);
}