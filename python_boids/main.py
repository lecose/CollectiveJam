from simulation import Simulator
from boid import Boid
from flock import Flock
import random


NUM_BOIDS = 50

# initialize simulator
sim = Simulator(width=1000, height=700, margin=50)

# generate random initial positions
boid_positions = [(random.randint(sim.margin, sim.width - sim.margin), random.randint(sim.margin, sim.height - sim.margin))
                   for _ in range(NUM_BOIDS)]

boids = [Boid(x_pos=boid_positions[i][0], y_pos=boid_positions[i][1], turnfactor=2.5, 
              max_speed=10, matching_factor=0.2, centering_factor=0.003) for i in range(NUM_BOIDS)]
flock = Flock(boids, protected_range=50, visible_range=70)

sim.run(flock=flock)