
class Flock
{
    Boid boids[];

    int protected_range;
    int visible_range;

    fun void update(int x_dim, int y_dim, int margin)
    {
        for(0 => int i; i < boids.size(); i++)
        {
            0 => boids[i].close_dx;
            0 => boids[i].close_dy;
            0 => boids[i].xvel_avg;
            0 => boids[i].yvel_avg;
            0 => boids[i].neighboring_boids;
            0 => boids[i].xpos_avg;
            0 => boids[i].ypos_avg;
            for(0 => int j; j < boids.size(); j++)
            {
                if(i != j)
                {
                    boids[i].manhattan_dist(boids[j]) => int dist;
                    
                    if(dist < protected_range)
                    {
                        boids[i].check_separation(boids[j]);
                    }
                    if(dist < visible_range)
                    {
                        boids[i].check_alignment(boids[j]);
                        boids[i].check_cohesion(boids[j]);
                    }
                }
            }
            boids[i].update(x_dim, y_dim, margin);

            <<< "boid ", i, ": (", boids[i].x_pos, ", ", boids[i].y_pos, ")" >>>;
        }
    }
}