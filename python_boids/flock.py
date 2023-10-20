from boid import Boid
from typing import List
import numpy as np
from itertools import compress

class Flock:

    boids: List[Boid]

    protected_range: int
    visible_range: int

    def __init__(
            self,
            boids: List[Boid],
            protected_range: int = 20,
            visible_range: int = 20
    ) -> None:
        self.boids = boids
        self.protected_range = protected_range
        self.visible_range = visible_range

    def update(self, x_dim: int, y_dim: int, margin: int) -> None:
        for i, boid in enumerate(self.boids):
            dist = np.array([boid.manhattan_dist(other_b) for other_b in self.boids])
            dist[i] = self.visible_range + self.protected_range
            boid.check_separation(list(compress(self.boids, dist < self.protected_range)))
            boid.check_alignment(list(compress(self.boids, dist < self.visible_range)))
            boid.check_cohesion(list(compress(self.boids, dist < self.visible_range)))
            boid.update(x_dim, y_dim, margin)