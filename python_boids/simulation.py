import pygame
from pygame.locals import *
from boid import Boid
from flock import Flock
from typing import List

class Simulator():

    width: int
    height: int
    margin: int

    def __init__(
            self,
            width: int = 500,
            height: int = 500,
            margin: int = 100
    ) -> None:
        self.width = width
        self.height = height
        self.margin = margin

    def run(self, flock: Flock) -> None:
        pygame.init()

        canvas = pygame.display.set_mode((self.width, self.height))
        
        pygame.display.set_caption("Boid Simulation")
        
        running = True
        
        while running:

            pygame.time.delay(30)

            for event in pygame.event.get():
                if event.type == KEYDOWN:
                    if event.key == K_BACKSPACE:
                        running = False
                elif event.type == QUIT:
                    running = False

            canvas.fill((0, 0, 0))

            flock.update(self.width, self.height, self.margin)

            for boid in flock.boids:
                pygame.draw.circle(canvas, boid.color, (boid.x_pos, boid.y_pos), (5))
            
            pygame.display.update()