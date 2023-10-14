import math
from typing import Tuple
import random
from typing import List

class Boid:

    # state variables
    x_pos: int
    y_pos: int
    x_vel: int
    y_vel: int

    max_speed: int
    min_speed: int
    turnfactor: int

    # separation variables
    close_dx: int
    close_dy: int
    avoid_factor: int

    # alignment variables
    xvel_avg: int
    yvel_avg: int
    neighboring_boids: int
    matching_factor: int

    # cohesion variables
    xpos_avg: int
    ypos_avg: int
    centering_factor: int

    # rendering variables
    color: Tuple

    rng: random.Random

    def __init__(
            self,
            x_pos: int = 0,
            y_pos: int = 0,
            max_speed: int = 6,
            min_speed: int = 3,
            avoid_factor: int = 0.05,
            matching_factor: int = 0.05,
            centering_factor: int = 0.0005,
            turnfactor: int = 0.2,
            color: Tuple = (0, 255, 0),
    ) -> None:
        self.x_pos = x_pos
        self.y_pos = y_pos
        self.max_speed = max_speed
        self.min_speed = min_speed
        self.close_dx = 0
        self.close_dy = 0
        self.avoid_factor = avoid_factor
        self.xvel_avg = 0
        self.yvel_avg = 0
        self.neighboring_boids = 0
        self.matching_factor = matching_factor
        self.xpos_avg = 0
        self.ypos_avg = 0
        self.centering_factor = centering_factor
        self.turnfactor = turnfactor
        self.color = color
        self.rng = random.Random()
        self.x_vel = self.rng.randint(-self.max_speed, self.max_speed)
        self.y_vel = self.rng.randint(-self.max_speed, self.max_speed)
    
    def update(self, x_dim: int, y_dim: int, margin: int) -> None:

        # separation
        self.x_vel += self.close_dx * self.avoid_factor
        self.y_vel += self.close_dy * self.avoid_factor

        if self.neighboring_boids > 0:
            # alignment
            self.x_vel += (self.xvel_avg - self.x_vel) * self.matching_factor
            self.y_vel += (self.yvel_avg - self.y_vel) * self.matching_factor

            # cohesion
            self.x_vel += (self.xpos_avg - self.x_pos) * self.centering_factor
            self.y_vel += (self.ypos_avg - self.y_pos) * self.centering_factor

        if self.x_pos < margin:
            self.x_vel += self.turnfactor
        elif self.x_pos > x_dim - margin:
            self.x_vel -= self.turnfactor

        if self.y_pos < margin:
            self.y_vel += self.turnfactor
        elif self.y_pos > y_dim - margin:
            self.y_vel -= self.turnfactor

        # limit boid velocity
        speed = math.sqrt(self.x_vel**2 + self.y_vel**2)
        if speed > self.max_speed:
            self.x_vel = int((self.x_vel / speed) * self.max_speed)
            self.y_vel = int((self.y_vel / speed) * self.max_speed)
        if speed < self.min_speed:
            self.x_vel = int((self.x_vel / speed) * self.min_speed)
            self.y_vel = int((self.y_vel / speed) * self.min_speed)

        self.x_pos = self.x_pos + self.x_vel
        self.y_pos = self.y_pos + self.y_vel

    def check_separation(self, other_boids: List):
        self.close_dx = 0
        self.close_dy = 0
        for other_boid in other_boids:
            dx, dy = self.separate(other_boid)
            self.close_dx += dx
            self.close_dy += dy

    def separate(self, other_boid):
        close_dx = self.x_pos - other_boid.x_pos
        close_dy = self.y_pos - other_boid.y_pos
        return close_dx, close_dy

    def check_alignment(self, other_boids: List):
        self.xvel_avg = 0
        self.yvel_avg = 0
        self.neighboring_boids = len(other_boids)
        if self.neighboring_boids > 0:
            for other_boid in other_boids:
                self.xvel_avg += other_boid.x_vel
                self.yvel_avg += other_boid.y_vel
            self.xvel_avg = self.xvel_avg // self.neighboring_boids
            self.yvel_avg = self.yvel_avg // self.neighboring_boids

    def check_cohesion(self, other_boids: List):
        self.xpos_avg = 0
        self.ypos_avg = 0
        if self.neighboring_boids > 0:
            for other_boid in other_boids:
                self.xpos_avg += other_boid.x_pos
                self.ypos_avg += other_boid.y_pos
            self.xpos_avg = self.xpos_avg // self.neighboring_boids
            self.ypos_avg = self.ypos_avg // self.neighboring_boids


    def manhattan_dist(self, other_boid):
        return abs(self.x_pos - other_boid.x_pos) + abs(self.y_pos - other_boid.y_pos)