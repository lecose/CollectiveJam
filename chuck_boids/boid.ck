class Boid
{
    int x_pos;
    int y_pos;
    float x_vel;
    float y_vel;

    int max_speed;
    int min_speed;
    float turnfactor;

    // separation variables
    int close_dx;
    int close_dy;
    float avoid_factor;

    // alignment variables
    float xvel_avg;
    float yvel_avg;
    int neighboring_boids;
    float matching_factor;

    // cohesion variables
    float xpos_avg;
    float ypos_avg;
    float centering_factor;

    fun void update(int x_dim, int y_dim, int margin)
    {
        // separation
        close_dx * avoid_factor +=> x_vel;
        close_dy * avoid_factor +=> y_vel;

        if(neighboring_boids > 0)
        {
            // alignment
            neighboring_boids /=> xvel_avg;
            neighboring_boids /=> yvel_avg;
            (xvel_avg - x_vel) * matching_factor +=> x_vel;
            (yvel_avg - y_vel) * matching_factor +=> y_vel;

            // cohesion
            neighboring_boids /=> xpos_avg;
            neighboring_boids /=> ypos_avg;
            (xpos_avg - x_pos) * centering_factor +=> x_vel;
            (ypos_avg - y_pos) * centering_factor +=> y_vel;
        }

        // turn back at margin
        if(x_pos < margin)
        {
            turnfactor +=> x_vel;
        }
        if(x_pos > x_dim - margin)
        {
            turnfactor -=> x_vel;
        }
        if(y_pos < margin)
        {
            turnfactor +=> y_vel;
        }
        if(y_pos > y_dim - margin)
        {
            turnfactor -=> y_vel;
        }

        // limit boid velocity
        Math.sqrt(Math.pow(x_vel, 2) + Math.pow(y_vel, 2)) => float speed;
        if(speed > max_speed)
        {
            (x_vel / speed) * max_speed => x_vel;
            (y_vel / speed) * max_speed => y_vel;
        }
        if(speed < min_speed)
        {
            (x_vel / speed) * min_speed => x_vel;
            (y_vel / speed) * min_speed => y_vel;            
        }

        // update position
        x_vel $ int +=> x_pos;
        y_vel $ int +=> y_pos;
    }

    fun void check_separation(Boid other_boid)
    {
        x_pos - other_boid.x_pos +=> close_dx;
        y_pos - other_boid.y_pos +=> close_dy;
    }

    fun void check_alignment(Boid other_boid)
    {
        1 +=> neighboring_boids;
        other_boid.x_vel +=> xvel_avg;
        other_boid.y_vel +=> yvel_avg;
    }

    fun void check_cohesion(Boid other_boid)
    {
        other_boid.x_pos +=> xpos_avg;
        other_boid.y_pos +=> ypos_avg;
    }

    fun int manhattan_dist(Boid other_boid)
    {
        Math.abs(x_pos - other_boid.x_pos) + Math.abs(y_pos - other_boid.y_pos) => int dist;
        return dist;
    }
}