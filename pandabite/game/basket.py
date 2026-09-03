import os
import pygame

from game.settings import (
    ENERGY_BASKET_IMAGE,
    BODY_BASKET_IMAGE,
    PROTECTIVE_BASKET_IMAGE,
    BASKET_WIDTH,
    BASKET_BOTTOM_MARGIN,
    BASKET_HIGHLIGHT_COLOR,
    BASKET_HIGHLIGHT_GLOW_COLOR,
    BASKET_LABEL_BG_COLOR,
    BASKET_LABEL_HOVER_BG_COLOR,
    BASKET_LABEL_CORRECT_BG_COLOR,
    BASKET_HOVER_SCALE,
    BASKET_CORRECT_DRAG_GLOW_COLOR,
    BASKET_CORRECT_DRAG_BORDER_COLOR,
    BASKET_CORRECT_DRAG_SPARKLE_COLOR,
    BASKET_CORRECT_DRAG_SCALE,
    BASKET_HINT_COLOR,
    BASKET_HINT_GLOW_COLOR,
    ORANGE,
    PINK,
    GREEN,
    GRAY,
)

# A theme color per group, used for the name label and hover glow.
GROUP_COLORS = {
    "energy": ORANGE,
    "body": PINK,
    "protective": GREEN,
}


def load_basket_image(images_dir, filename):
    """Load one basket image safely. Returns a simple placeholder if it fails."""
    path = os.path.join(images_dir, filename)
    try:
        image = pygame.image.load(path).convert_alpha()
    except (pygame.error, FileNotFoundError):
        image = pygame.Surface((BASKET_WIDTH, BASKET_WIDTH), pygame.SRCALPHA)
        pygame.draw.rect(image, GRAY, image.get_rect(), border_radius=20)
        return image

    ratio = BASKET_WIDTH / image.get_width()
    new_size = (BASKET_WIDTH, int(image.get_height() * ratio))
    return pygame.transform.scale(image, new_size)


class Basket:
    def __init__(self, name, short_label, group, image, center_x, bottom_y):
        self.name = name
        self.short_label = short_label
        self.group = group
        self.image = image
        self.rect = self.image.get_rect(midbottom=(center_x, bottom_y))
        self.is_hovered = False
        self.color = GROUP_COLORS.get(group, ORANGE)
        self.label_font = pygame.font.SysFont("Arial", 20, bold=True)
        self.label_font_hover = pygame.font.SysFont("Arial", 23, bold=True)
        self.sublabel_font = pygame.font.SysFont("Arial", 14)

        # Set by show_hint() after a wrong answer: a brief, gentle highlight
        # on the CORRECT basket, distinct from the gold drag-hover highlight,
        # so the player gets a soft teaching nudge without it looking like
        # they're actively hovering it.
        self.hint_until_ms = 0

        # Set (only while actively dragging) by check_rect_hover(): whether
        # this basket is both hovered AND the correct group for the food
        # currently being dragged. Never set outside of a drag, so the
        # correct answer is never revealed before the player starts dragging.
        self.is_correct_drag_target = False

    def check_hover(self, point):
        """Update (and return) whether the given point is over this basket.
        Plain mouse hover (not dragging) never distinguishes correct/wrong.
        """
        self.is_hovered = self.rect.collidepoint(point)
        self.is_correct_drag_target = False
        return self.is_hovered

    def check_rect_hover(self, other_rect, is_correct_group=False):
        """Update (and return) whether another rect (e.g. dragged food) overlaps
        this basket. `is_correct_group` tells us whether this basket is the
        right group for the food currently being dragged, so draw() can give
        the correct basket a visibly stronger "yes!" highlight.
        """
        self.is_hovered = self.rect.colliderect(other_rect)
        self.is_correct_drag_target = self.is_hovered and is_correct_group
        return self.is_hovered

    def show_hint(self, duration_ms):
        """Briefly highlight this basket as the correct answer (called on the
        correct basket right after a wrong drop)."""
        self.hint_until_ms = pygame.time.get_ticks() + duration_ms

    def _draw_mini_sparkle(self, screen, center, size=6):
        """Tiny 4-point sparkle accent, used only for the correct-drag-target glow."""
        x, y = center
        pygame.draw.polygon(screen, BASKET_CORRECT_DRAG_SPARKLE_COLOR,
                             [(x, y - size), (x + size // 3, y), (x, y + size), (x - size // 3, y)])
        pygame.draw.polygon(screen, BASKET_CORRECT_DRAG_SPARKLE_COLOR,
                             [(x - size, y), (x, y - size // 3), (x + size, y), (x, y + size // 3)])

    def draw(self, screen):
        is_hinted = (not self.is_hovered) and pygame.time.get_ticks() < self.hint_until_ms

        if self.is_hovered and self.is_correct_drag_target:
            # Stronger "yes, this one!" highlight while dragging over the
            # correct basket -- bigger glow, a touch more scale, and sparkles.
            glow_rect = self.rect.inflate(38, 38)
            glow_surface = pygame.Surface(glow_rect.size, pygame.SRCALPHA)
            pygame.draw.ellipse(glow_surface, BASKET_CORRECT_DRAG_GLOW_COLOR, glow_surface.get_rect())
            screen.blit(glow_surface, glow_rect)

            lifted_size = (int(self.image.get_width() * BASKET_CORRECT_DRAG_SCALE),
                            int(self.image.get_height() * BASKET_CORRECT_DRAG_SCALE))
            lifted_image = pygame.transform.smoothscale(self.image, lifted_size)
            lifted_rect = lifted_image.get_rect(center=self.rect.center)
            screen.blit(lifted_image, lifted_rect)
            pygame.draw.rect(screen, BASKET_CORRECT_DRAG_BORDER_COLOR, self.rect, width=6, border_radius=15)

            self._draw_mini_sparkle(screen, (self.rect.left - 4, self.rect.top + 6))
            self._draw_mini_sparkle(screen, (self.rect.right + 4, self.rect.top + 14))
        elif self.is_hovered:
            # Neutral highlight: plain mouse hover, or dragging over a basket
            # that isn't the right one -- kept soft/gold, never red or alarming.
            glow_rect = self.rect.inflate(28, 28)
            glow_surface = pygame.Surface(glow_rect.size, pygame.SRCALPHA)
            pygame.draw.ellipse(glow_surface, BASKET_HIGHLIGHT_GLOW_COLOR, glow_surface.get_rect())
            screen.blit(glow_surface, glow_rect)

            # Subtle "lift": drawn a touch larger, still centered on the same
            # spot, so the hovered basket reads as an obvious drop target.
            lifted_size = (int(self.image.get_width() * BASKET_HOVER_SCALE),
                            int(self.image.get_height() * BASKET_HOVER_SCALE))
            lifted_image = pygame.transform.smoothscale(self.image, lifted_size)
            lifted_rect = lifted_image.get_rect(center=self.rect.center)
            screen.blit(lifted_image, lifted_rect)
            pygame.draw.rect(screen, BASKET_HIGHLIGHT_COLOR, self.rect, width=5, border_radius=15)
        elif is_hinted:
            glow_rect = self.rect.inflate(22, 22)
            glow_surface = pygame.Surface(glow_rect.size, pygame.SRCALPHA)
            pygame.draw.ellipse(glow_surface, BASKET_HINT_GLOW_COLOR, glow_surface.get_rect())
            screen.blit(glow_surface, glow_rect)

            screen.blit(self.image, self.rect)
            pygame.draw.rect(screen, BASKET_HINT_COLOR, self.rect, width=4, border_radius=15)
        else:
            screen.blit(self.image, self.rect)

        self._draw_label(screen, emphasize=self.is_hovered, extra_bright=self.is_correct_drag_target)

    def _draw_label(self, screen, emphasize=False, extra_bright=False):
        """Two-line label under the basket: the short caps name (ENERGY / BODY /
        PROTECTIVE) plus a smaller descriptive line (Energy-Giving /
        Body-Building / Protective), e.g. derived from self.name by dropping
        its trailing " Foods".
        """
        font = self.label_font_hover if emphasize else self.label_font
        if extra_bright:
            bg_color = BASKET_LABEL_CORRECT_BG_COLOR
        elif emphasize:
            bg_color = BASKET_LABEL_HOVER_BG_COLOR
        else:
            bg_color = BASKET_LABEL_BG_COLOR

        subtitle = self.name[:-len(" Foods")] if self.name.endswith(" Foods") else self.name

        title_surface = font.render(self.short_label.upper(), True, self.color)
        subtitle_surface = self.sublabel_font.render(subtitle, True, self.color)

        pill_width = max(title_surface.get_width(), subtitle_surface.get_width()) + 26
        pill_height = title_surface.get_height() + subtitle_surface.get_height() + 14
        pill_rect = pygame.Rect(0, 0, pill_width, pill_height)
        pill_rect.midtop = (self.rect.centerx, self.rect.bottom + 8)

        pygame.draw.rect(screen, bg_color, pill_rect, border_radius=16)
        pygame.draw.rect(screen, self.color, pill_rect, width=2, border_radius=16)

        title_y = pill_rect.top + 6
        screen.blit(title_surface, (pill_rect.centerx - title_surface.get_width() // 2, title_y))
        subtitle_y = title_y + title_surface.get_height()
        screen.blit(subtitle_surface, (pill_rect.centerx - subtitle_surface.get_width() // 2, subtitle_y))


def create_baskets(screen_width, screen_height, base_dir):
    """Build the 3 sorting baskets, spread evenly across the bottom of the screen."""
    images_dir = os.path.join(base_dir, "assets", "images")
    bottom_y = screen_height - BASKET_BOTTOM_MARGIN

    center_xs = [screen_width // 6, screen_width // 2, screen_width * 5 // 6]

    basket_specs = [
        ("Energy-Giving Foods", "Energy", "energy", ENERGY_BASKET_IMAGE),
        ("Body-Building Foods", "Body", "body", BODY_BASKET_IMAGE),
        ("Protective Foods", "Protective", "protective", PROTECTIVE_BASKET_IMAGE),
    ]

    baskets = []
    for (name, short_label, group, filename), center_x in zip(basket_specs, center_xs):
        image = load_basket_image(images_dir, filename)
        baskets.append(Basket(name, short_label, group, image, center_x, bottom_y))
    return baskets
