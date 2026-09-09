import math
import os
import pygame

from game.settings import (
    PANDA_IDLE_FRAMES,
    PANDA_HAPPY_FRAMES,
    PANDA_SAD_FRAMES,
    PANDA_FRAME_DURATION_MS,
    PANDA_HAPPY_BOUNCE_AMPLITUDE_PX,
    PANDA_HAPPY_BOUNCE_PERIOD_MS,
    FPS,
    ORANGE,
    BLACK,
)

PLACEHOLDER_SIZE = (150, 150)


def make_placeholder():
    """Simple orange circle used if a panda image file is missing."""
    surface = pygame.Surface(PLACEHOLDER_SIZE, pygame.SRCALPHA)
    center = (PLACEHOLDER_SIZE[0] // 2, PLACEHOLDER_SIZE[1] // 2)
    radius = PLACEHOLDER_SIZE[0] // 2
    pygame.draw.circle(surface, ORANGE, center, radius)
    pygame.draw.circle(surface, BLACK, center, radius, width=3)
    return surface


def load_image(images_dir, filename, height=None):
    """Load one image safely, optionally scaled to a target height. Returns a placeholder if it fails."""
    path = os.path.join(images_dir, filename)
    try:
        image = pygame.image.load(path).convert_alpha()
    except (pygame.error, FileNotFoundError):
        image = make_placeholder()

    if height is not None:
        ratio = height / image.get_height()
        image = pygame.transform.scale(image, (int(image.get_width() * ratio), height))
    return image


class Panda:
    def __init__(self, base_dir, x, bottom_y, height=None):
        images_dir = os.path.join(base_dir, "assets", "images")

        # Load all animation frames for each mood, up front.
        self.frames = {
            "idle": [load_image(images_dir, name, height) for name in PANDA_IDLE_FRAMES],
            "happy": [load_image(images_dir, name, height) for name in PANDA_HAPPY_FRAMES],
            "sad": [load_image(images_dir, name, height) for name in PANDA_SAD_FRAMES],
        }

        self.state = "idle"
        self.frame_index = 0
        self.frame_timer_ms = pygame.time.get_ticks()

        self.image = self.frames[self.state][self.frame_index]
        self.rect = self.image.get_rect()

        # Position: bottom-anchored at (x, bottom_y), placed by the caller so it
        # never overlaps the baskets. The panda does not move yet.
        self.x = x
        self.y = bottom_y
        self.rect.midbottom = (self.x, self.y)

        # Clock for the happy-mood bounce (see draw()). Only advances while
        # happy, via update(), so it resets cleanly each time and freezes
        # along with the rest of gameplay while paused.
        self.happy_anim_ms = 0

    def _set_state(self, new_state):
        if self.state == new_state:
            return
        self.state = new_state
        self.frame_index = 0
        self.frame_timer_ms = pygame.time.get_ticks()
        self.happy_anim_ms = 0
        self.image = self.frames[self.state][self.frame_index]
        self.rect = self.image.get_rect(midbottom=(self.x, self.y))

    def set_idle(self):
        self._set_state("idle")

    def set_happy(self):
        self._set_state("happy")

    def set_sad(self):
        self._set_state("sad")

    def update(self):
        """Cycle between the 2 frames of the current mood to create simple motion."""
        now = pygame.time.get_ticks()
        if now - self.frame_timer_ms >= PANDA_FRAME_DURATION_MS:
            self.frame_timer_ms = now
            frame_list = self.frames[self.state]
            self.frame_index = (self.frame_index + 1) % len(frame_list)
            self.image = frame_list[self.frame_index]
            self.rect = self.image.get_rect(midbottom=(self.x, self.y))

        if self.state == "happy":
            self.happy_anim_ms += 1000 / FPS

    def draw(self, screen):
        """Blit the panda, with a little repeated hop while happy (a pure
        drawing offset -- self.rect, used for layout elsewhere, is untouched).
        """
        if self.state == "happy":
            cycle = (self.happy_anim_ms % PANDA_HAPPY_BOUNCE_PERIOD_MS) / PANDA_HAPPY_BOUNCE_PERIOD_MS
            # abs(sin) stays >= 0, so it reads as a bounce (hop-hop-hop)
            # rather than a smooth up/down glide.
            bounce = abs(math.sin(cycle * math.pi)) * PANDA_HAPPY_BOUNCE_AMPLITUDE_PX
            screen.blit(self.image, self.rect.move(0, -bounce))
        else:
            screen.blit(self.image, self.rect)
