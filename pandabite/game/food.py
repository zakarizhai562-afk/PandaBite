import math
import os
import random
import pygame

from game.settings import (
    FPS,
    FOOD_IMAGE_WIDTH,
    FOOD_FALL_MARGIN_X,
    FOOD_FALL_START_Y,
    FOOD_FALL_START_Y_JITTER,
    FOOD_FALL_SPEED,
    FOOD_FALL_SPEED_INCREMENT,
    FOOD_WOBBLE_AMPLITUDE_DEGREES,
    FOOD_WOBBLE_PERIOD_MS,
    FOOD_BOB_AMPLITUDE_PX,
    FOOD_BOB_PERIOD_MS,
    FOOD_DRAG_LIFT_SCALE,
    FOOD_SHADOW_COLOR,
    SCREEN_WIDTH,
    GRAY,
)

# The only 3 groups a food is allowed to belong to.
VALID_GROUPS = ("energy", "body", "protective")

# Every food the game can spawn, grouped by which basket it belongs in:
# Energy-Giving (10), Body-Building (9), Protective (9).
FOOD_DATA = [
    # Energy-Giving Foods
    {"name": "Rice", "group": "energy", "image": "rice.png"},
    {"name": "Bread", "group": "energy", "image": "bread.png"},
    {"name": "Noodles", "group": "energy", "image": "noodles.png"},
    {"name": "Corn", "group": "energy", "image": "corn.png"},
    {"name": "Potato", "group": "energy", "image": "potato.png"},
    {"name": "Sweet Potato", "group": "energy", "image": "sweet_potato.png"},
    {"name": "Cereals", "group": "energy", "image": "cereals.png"},
    {"name": "Pancakes", "group": "energy", "image": "pancakes.png"},
    {"name": "Wheat / Flour", "group": "energy", "image": "wheat_flour.png"},
    {"name": "Banana", "group": "energy", "image": "banana.png"},

    # Body-Building Foods
    {"name": "Chicken", "group": "body", "image": "chicken.png"},
    {"name": "Beef", "group": "body", "image": "beef.png"},
    {"name": "Fish", "group": "body", "image": "fish.png"},
    {"name": "Egg", "group": "body", "image": "egg.png"},
    {"name": "Milk", "group": "body", "image": "milk.png"},
    {"name": "Cheese", "group": "body", "image": "cheese.png"},
    {"name": "Beans", "group": "body", "image": "beans.png"},
    {"name": "Soybeans", "group": "body", "image": "soybeans.png"},
    {"name": "Peanut", "group": "body", "image": "peanut.png"},

    # Protective Foods
    {"name": "Carrot", "group": "protective", "image": "carrot.png"},
    {"name": "Broccoli", "group": "protective", "image": "broccoli.png"},
    {"name": "Tomato", "group": "protective", "image": "tomato.png"},
    {"name": "Cucumber", "group": "protective", "image": "cucumber.png"},
    {"name": "Orange", "group": "protective", "image": "orange.png"},
    {"name": "Apple", "group": "protective", "image": "apple.png"},
    {"name": "Watermelon", "group": "protective", "image": "watermelon.png"},
    {"name": "Mango", "group": "protective", "image": "mango.png"},
    {"name": "Pineapple", "group": "protective", "image": "pineapple.png"},
]


def validate_food_data(food_data):
    """Raise ValueError (listing every problem found) if the dataset is malformed:
    missing names, duplicate names, missing/invalid groups, or missing image filenames.
    """
    errors = []
    seen_names = set()

    for index, entry in enumerate(food_data):
        name = (entry.get("name") or "").strip()
        group = (entry.get("group") or "").strip()
        image = (entry.get("image") or "").strip()
        label = name if name else f"entry #{index}"

        if not name:
            errors.append(f"Entry #{index}: missing name")
        elif name in seen_names:
            errors.append(f"Duplicate food name: '{name}'")
        else:
            seen_names.add(name)

        if not group:
            errors.append(f"'{label}': missing group")
        elif group not in VALID_GROUPS:
            errors.append(f"'{label}': invalid group '{group}' (valid groups: {VALID_GROUPS})")

        if not image:
            errors.append(f"'{label}': missing image filename")

    if errors:
        raise ValueError("FOOD_DATA validation failed:\n- " + "\n- ".join(errors))


def find_missing_image_files(food_data, images_dir):
    """Return the list of image filenames referenced by food_data that don't exist on disk yet."""
    missing = []
    for entry in food_data:
        image_path = os.path.join(images_dir, entry["image"])
        if not os.path.exists(image_path):
            missing.append(entry["image"])
    return missing


def print_food_summary(food_data, images_dir=None):
    """Print group counts, the total, and (if images_dir is given) any missing image files."""
    counts = {"energy": 0, "body": 0, "protective": 0}
    for entry in food_data:
        counts[entry["group"]] += 1

    print(f"Energy-Giving: {counts['energy']}")
    print(f"Body-Building: {counts['body']}")
    print(f"Protective: {counts['protective']}")
    print(f"Total: {len(food_data)}")

    if images_dir is not None:
        missing = find_missing_image_files(food_data, images_dir)
        if missing:
            print(f"Missing image files ({len(missing)}):")
            for filename in missing:
                print(f"  - {filename}")
        else:
            print("All image files present.")


# Check the data as soon as this module is loaded, so a typo is caught early.
# (This checks the data itself, not whether the image files exist on disk yet.)
validate_food_data(FOOD_DATA)


def load_food_image(images_dir, filename):
    """Load one food image safely, scaled to fit inside a FOOD_IMAGE_WIDTH
    square box (preserving its aspect ratio and centered on transparent
    padding) so every food appears the same size on screen. Returns a simple
    placeholder if it fails.
    """
    path = os.path.join(images_dir, filename)
    try:
        image = pygame.image.load(path).convert_alpha()
    except (pygame.error, FileNotFoundError):
        image = pygame.Surface((FOOD_IMAGE_WIDTH, FOOD_IMAGE_WIDTH), pygame.SRCALPHA)
        pygame.draw.rect(image, GRAY, image.get_rect(), border_radius=12)
        return image

    scale = min(FOOD_IMAGE_WIDTH / image.get_width(), FOOD_IMAGE_WIDTH / image.get_height())
    new_size = (max(1, int(image.get_width() * scale)), max(1, int(image.get_height() * scale)))
    scaled_image = pygame.transform.scale(image, new_size)

    canvas = pygame.Surface((FOOD_IMAGE_WIDTH, FOOD_IMAGE_WIDTH), pygame.SRCALPHA)
    canvas.blit(scaled_image, scaled_image.get_rect(center=(FOOD_IMAGE_WIDTH // 2, FOOD_IMAGE_WIDTH // 2)))
    return canvas


class Food:
    def __init__(self, data, base_dir, x, y, fall_speed=FOOD_FALL_SPEED):
        if data["group"] not in VALID_GROUPS:
            raise ValueError(
                f"Invalid food group '{data['group']}' for '{data['name']}'. "
                f"Valid groups are: {VALID_GROUPS}"
            )

        self.name = data["name"]
        self.group = data["group"]

        images_dir = os.path.join(base_dir, "assets", "images")
        self.image = load_food_image(images_dir, data["image"])
        self.rect = self.image.get_rect(center=(x, y))

        # Remembered so the food can snap back to the top and resume falling
        # if it's dropped outside a basket (dropped on the wrong basket).
        self.start_pos = (x, y)

        self.fall_speed = fall_speed
        self.dragging = False
        self.drag_offset_x = 0
        self.drag_offset_y = 0

        # A float mirror of rect.y. rect.y itself is always an int (pygame
        # truncates on assignment), so accumulating fall_speed directly onto
        # it would silently stall out for any fall_speed below 1 -- tracking
        # the true position separately lets fall_speed be a fraction of a
        # pixel per frame for finer-grained (e.g. slower) fall speeds.
        self.y_float = float(self.rect.y)

        # Wobble animation clock. Advanced only in fall() (not real wall-clock
        # time), so it correctly freezes along with the rest of gameplay while
        # the game is paused, instead of visibly spinning behind the pause overlay.
        self.wobble_time_ms = 0

    def start_drag(self, mouse_pos):
        """Begin dragging: remember the offset between the cursor and the
        food's current position, so it keeps following the cursor from
        wherever it was grabbed instead of jumping to re-center under it.
        """
        self.dragging = True
        self.drag_offset_x = self.rect.x - mouse_pos[0]
        self.drag_offset_y = self.rect.y - mouse_pos[1]

    def drag_to(self, mouse_pos):
        """Follow the cursor every frame while preserving the grab offset."""
        self.rect.x = mouse_pos[0] + self.drag_offset_x
        self.rect.y = mouse_pos[1] + self.drag_offset_y

    def reset_position(self):
        self.rect.center = self.start_pos
        self.y_float = float(self.rect.y)

    def fall(self):
        """Drift down one step. Call this only while the food is not being dragged."""
        self.y_float += self.fall_speed
        self.rect.y = round(self.y_float)
        self.wobble_time_ms += 1000 / FPS

    def _draw_shadow(self, screen, center, radius):
        """Very soft translucent ellipse under the food, for a subtle sense of depth."""
        shadow_rect = pygame.Rect(0, 0, radius * 2, int(radius * 0.7))
        shadow_rect.center = (center[0], center[1] + radius * 0.75)
        shadow_surface = pygame.Surface(shadow_rect.size, pygame.SRCALPHA)
        pygame.draw.ellipse(shadow_surface, FOOD_SHADOW_COLOR, shadow_surface.get_rect())
        screen.blit(shadow_surface, shadow_rect)

    def draw(self, screen):
        if self.dragging:
            # No wobble while dragging, so it stays perfectly under the cursor.
            # Drawn slightly larger than the (unchanged) collision rect, so it
            # visually "lifts" off the tray without affecting drop detection.
            self._draw_shadow(screen, self.rect.center, self.rect.width // 2)
            lifted_size = (int(self.image.get_width() * FOOD_DRAG_LIFT_SCALE),
                           int(self.image.get_height() * FOOD_DRAG_LIFT_SCALE))
            lifted_image = pygame.transform.smoothscale(self.image, lifted_size)
            lifted_rect = lifted_image.get_rect(center=self.rect.center)
            screen.blit(lifted_image, lifted_rect)
            return

        self._draw_shadow(screen, self.rect.center, self.rect.width // 2)

        cycle = (self.wobble_time_ms % FOOD_WOBBLE_PERIOD_MS) / FOOD_WOBBLE_PERIOD_MS
        angle = math.sin(cycle * 2 * math.pi) * FOOD_WOBBLE_AMPLITUDE_DEGREES

        # A small vertical bob layered on top of the fall -- a draw-only
        # offset (the real rect.y, used for falling/collision, is untouched).
        bob_cycle = (self.wobble_time_ms % FOOD_BOB_PERIOD_MS) / FOOD_BOB_PERIOD_MS
        bob_offset = math.sin(bob_cycle * 2 * math.pi) * FOOD_BOB_AMPLITUDE_PX

        rotated_image = pygame.transform.rotate(self.image, angle)
        rotated_rect = rotated_image.get_rect(center=(self.rect.centerx, self.rect.centery + bob_offset))
        screen.blit(rotated_image, rotated_rect)


def spawn_falling_food(base_dir, level=1):
    """Create one food, randomly chosen from FOOD_DATA, ready to fall.
    Falls faster on later levels.

    The spawn x is picked so the food's *entire* rect (not just its center)
    stays within [FOOD_FALL_MARGIN_X, SCREEN_WIDTH - FOOD_FALL_MARGIN_X],
    regardless of FOOD_IMAGE_WIDTH. The spawn y also varies a little (upper to
    lower-middle of the play area, via FOOD_FALL_START_Y_JITTER) so new food
    doesn't always appear at the exact same spot.
    """
    data = random.choice(FOOD_DATA)
    half_width = FOOD_IMAGE_WIDTH // 2
    x = random.randint(FOOD_FALL_MARGIN_X + half_width, SCREEN_WIDTH - FOOD_FALL_MARGIN_X - half_width)
    y = FOOD_FALL_START_Y + random.randint(0, FOOD_FALL_START_Y_JITTER)
    fall_speed = FOOD_FALL_SPEED + (level - 1) * FOOD_FALL_SPEED_INCREMENT
    return Food(data, base_dir, x, y, fall_speed=fall_speed)


if __name__ == "__main__":
    # Run this file directly (e.g. `python game/food.py` from the pandabite folder)
    # to print a report of the dataset and which image files are still missing.
    pandabite_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print_food_summary(FOOD_DATA, images_dir=os.path.join(pandabite_dir, "assets", "images"))
