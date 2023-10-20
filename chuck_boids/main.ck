1000 => int x_dim;
700 => int y_dim;
50 => int margin;

1 => int num_boids;
Boid boids[num_boids];

10 => int max_speed;
0 => int min_speed;
0.06 => float avoid_factor;
0.2 => float matching_factor;
0.003 => float centering_factor;
2.5 => float turnfactor;


for(0 => int i; i < num_boids; i++)
{
    initialize_boid(max_speed, min_speed, avoid_factor, matching_factor, centering_factor, turnfactor) @=> boids[i];
}

Flock flock;
50 => flock.protected_range;
70 => flock.visible_range;
boids @=> flock.boids;

fun Boid initialize_boid(int max_speed, int min_speed, float avoid_factor, 
                        float matching_factor, float centering_factor, float turnfactor)
{
    Boid b;
    Math.random2(0, x_dim - margin) => b.x_pos;
    Math.random2(0, y_dim - margin) => b.y_pos;
    Math.random2(-max_speed, max_speed) => b.x_vel;
    Math.random2(-max_speed, max_speed) => b.y_vel;
    max_speed => b.max_speed;
    min_speed => b.min_speed;
    avoid_factor => b.avoid_factor;
    matching_factor => b.matching_factor;
    centering_factor => b.centering_factor;
    turnfactor => b.turnfactor;
    0 => b.close_dx => b.close_dy;
    0 => b.xvel_avg => b.yvel_avg;
    0 => b.neighboring_boids;
    0 => b.xpos_avg => b.ypos_avg;

    return b;
}