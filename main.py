import math
import os
import random
import sys
import pygame

if sys.platform == "win32":
    # Tell Windows this app handles its own scaling. Without this, on any
    # display with scaling above 100% (very common), Windows silently
    # rescales mouse coordinates before pygame sees them, so the cursor and
    # the dragged food drift apart the further the mouse is from the corner.
    import ctypes
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except (AttributeError, OSError):
        pass

    # Windows' default timer resolution (~15.6ms) makes clock.tick() pace
    # frames unevenly (frames arrive in uneven clumps instead of a steady
    # ~16.7ms apart), which shows up as jerky motion during fast mouse drags
    # even though the average FPS looks fine. Requesting a 1ms timer fixes it.
    try:
        ctypes.windll.winmm.timeBeginPeriod(1)
    except (AttributeError, OSError):
        pass

from game.settings import (
    # Window
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    FPS,
    WINDOW_TITLE,
    BACKGROUND_IMAGE,
    # Audio
    BACKGROUND_MUSIC,
    BACKGROUND_MUSIC_VOLUME,
    SFX_CATCH_CORRECT,
    SFX_CATCH_WRONG,
    SFX_LEVEL_COMPLETE,
    SFX_CLICK,
    SFX_VOLUME,
    # Feedback styling ("Great Job!" / "Try Again!") shown inside the message box
    FEEDBACK_DURATION_MS,
    FEEDBACK_FADE_MS,
    FEEDBACK_CARD_CORRECT_BG,
    FEEDBACK_CARD_CORRECT_BORDER,
    FEEDBACK_CARD_WRONG_BG,
    FEEDBACK_CARD_WRONG_BORDER,
    FEEDBACK_TITLE_COLOR,
    FEEDBACK_DETAIL_COLOR,
    # Single combined message system (big panda + speech-bubble box), centered as a group
    MESSAGE_ROW_GAP,
    PANDA_HEADER_HEIGHT,
    MESSAGE_BOX_HEIGHT,
    MESSAGE_BOX_WIDTH,
    MESSAGE_BOX_SIDE_MARGIN,
    MESSAGE_BOX_TAIL_GAP,
    MESSAGE_BOX_COLOR,
    MESSAGE_BOX_BORDER_COLOR,
    MESSAGE_BOX_SHADOW_COLOR,
    MESSAGE_BOX_TEXT_COLOR,
    MESSAGE_BOX_HIGHLIGHT_COLOR,
    SPARKLE_COLOR,
    MESSAGE_TEXTS_IDLE,
    MESSAGE_TEXTS_HAPPY,
    MESSAGE_TEXTS_SAD,
    TUTORIAL_HINT_TEXT,
    TUTORIAL_HINT_DURATION_MS,
    TUTORIAL_HINT_ARROW_COLOR,
    TUTORIAL_HINT_FADE_MS,
    # Falling-food play area
    FOOD_AREA_DECORATION_COLOR,
    FOOD_DISAPPEAR_DURATION_MS,
    # Drag-and-drop feedback: "Drop Here" hint + gentle post-mistake basket hint
    DROP_HERE_TEXT,
    DROP_HERE_BG_COLOR,
    DROP_HERE_TEXT_COLOR,
    BASKET_HINT_DURATION_MS,
    # Floating "+10" popup on a correct answer
    FLOATING_SCORE_COLOR,
    FLOATING_SCORE_DURATION_MS,
    FLOATING_SCORE_RISE_PX,
    # HUD panel (title / score / lives / level) -- now the very top row
    HUD_TOP,
    HUD_PANEL_HEIGHT,
    HUD_PANEL_COLOR,
    HUD_TITLE_TEXT,
    HUD_TITLE_COLOR,
    HEART_SIZE,
    HEART_FULL_COLOR,
    HEART_EMPTY_COLOR,
    PROGRESS_BAR_BG_COLOR,
    PROGRESS_BAR_FILL_COLOR,
    PROGRESS_BAR_WIDTH,
    PROGRESS_BAR_HEIGHT,
    # Game Over / Level Complete / Game Complete screens
    GAME_OVER_BG_COLOR,
    GAME_OVER_CARD_COLOR,
    PLAY_AGAIN_BUTTON_COLOR,
    PLAY_AGAIN_BUTTON_HOVER_COLOR,
    PLAY_AGAIN_BUTTON_WIDTH,
    PLAY_AGAIN_BUTTON_HEIGHT,
    LEVEL_COMPLETE_BG_COLOR,
    LEVEL_COMPLETE_CARD_COLOR,
    GAME_COMPLETE_BG_COLOR,
    GAME_COMPLETE_CARD_COLOR,
    STAR_FILLED_COLOR,
    STAR_EMPTY_COLOR,
    STAR_SIZE,
    STAR_SPACING,
    # Basic colors
    WHITE,
    BLACK,
    GREEN,
    ORANGE,
    YELLOW,
)
from game.basket import create_baskets
from game.food import spawn_falling_food
from game.panda import Panda
from game.game_state import (
    GameState,
    PLAYING,
    PAUSED,
    GAME_OVER,
    LEVEL_COMPLETE,
    GAME_COMPLETE,
    STARTING_LIVES,
    SCORE_TO_LEVEL_COMPLETE,
    MAX_LEVEL,
    POINTS_PER_CORRECT,
)

# Project root (folder that contains this file), used for asset paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKGROUND_PATH = os.path.join(BASE_DIR, "assets", "images", BACKGROUND_IMAGE)
SOUNDS_DIR = os.path.join(BASE_DIR, "assets", "sounds")
MUSIC_PATH = os.path.join(SOUNDS_DIR, BACKGROUND_MUSIC)


def load_background(width, height):
    """Load and scale the background image. Falls back to None if not found yet."""
    if os.path.exists(BACKGROUND_PATH):
        image = pygame.image.load(BACKGROUND_PATH).convert()
        return pygame.transform.scale(image, (width, height))
    return None


def start_background_music():
    """Load and loop the background music if the file exists. Returns True if
    music is now playing, so pause/resume calls know whether there's anything to do.
    Safe to call even with no audio device or no music file -- just does nothing.
    """
    if not os.path.exists(MUSIC_PATH):
        return False
    try:
        pygame.mixer.init()
        pygame.mixer.music.load(MUSIC_PATH)
        pygame.mixer.music.set_volume(BACKGROUND_MUSIC_VOLUME)
        pygame.mixer.music.play(loops=-1)
        return True
    except pygame.error:
        return False


def load_sound_effect(filename, volume=SFX_VOLUME):
    """Load one short sound effect. Returns None if the file is missing or no
    audio device is available, so callers can safely play_sound() either way.
    """
    path = os.path.join(SOUNDS_DIR, filename)
    if not os.path.exists(path):
        return None
    try:
        pygame.mixer.init()
        sound = pygame.mixer.Sound(path)
        sound.set_volume(volume)
        return sound
    except pygame.error:
        return None


def play_sound(sound):
    """Play a loaded sound effect. No-op if it never loaded (missing file/no audio device)."""
    if sound is not None:
        sound.play()


def find_dropped_basket(baskets, food_rect):
    """Return the basket the food was dropped on, or None if it missed all of them."""
    for basket in baskets:
        if basket.rect.colliderect(food_rect):
            return basket
    return None


def find_basket_by_group(baskets, group):
    """Return the basket matching a food group (used to tell the player the right answer)."""
    for basket in baskets:
        if basket.group == group:
            return basket
    return None


def draw_heart(screen, center, size, color):
    """Draw one simple heart shape (2 circles + a triangle) centered at `center`."""
    x, y = center
    r = size // 4
    pygame.draw.circle(screen, color, (x - r, y - r), r)
    pygame.draw.circle(screen, color, (x + r, y - r), r)
    points = [(x - size // 2, y - r // 2), (x + size // 2, y - r // 2), (x, y + size // 2)]
    pygame.draw.polygon(screen, color, points)


def draw_star(screen, center, size, color):
    """Draw one filled 5-point star centered at `center`."""
    cx, cy = center
    inner_size = size * 0.4
    points = []
    for i in range(10):
        angle = math.pi / 2 + i * math.pi / 5
        radius = size if i % 2 == 0 else inner_size
        points.append((cx + radius * math.cos(angle), cy - radius * math.sin(angle)))
    pygame.draw.polygon(screen, color, points)


def draw_star_rating(screen, center_x, y, rating, total=3):
    """Row of `total` stars, the first `rating` of them filled gold."""
    start_x = center_x - (total - 1) * STAR_SPACING // 2
    for i in range(total):
        x = start_x + i * STAR_SPACING
        color = STAR_FILLED_COLOR if i < rating else STAR_EMPTY_COLOR
        draw_star(screen, (x, y), STAR_SIZE, color)


def draw_hud(screen, game_state, fonts, hud_top):
    """Compact rounded panel: title, lives (hearts), score + progress bar, and level."""
    font_title, font_score, font_level = fonts

    panel_rect = pygame.Rect(20, hud_top, SCREEN_WIDTH - 40, HUD_PANEL_HEIGHT)
    panel_surface = pygame.Surface(panel_rect.size, pygame.SRCALPHA)
    pygame.draw.rect(panel_surface, HUD_PANEL_COLOR, panel_surface.get_rect(), border_radius=24)
    screen.blit(panel_surface, panel_rect)

    # Title (far left).
    title_label = font_title.render(HUD_TITLE_TEXT, True, HUD_TITLE_COLOR)
    screen.blit(title_label, (panel_rect.left + 24, panel_rect.centery - title_label.get_height() // 2))

    # Lives, as hearts (just after the title).
    heart_y = panel_rect.centery
    hearts_left = panel_rect.left + 24 + title_label.get_width() + 30
    for i in range(STARTING_LIVES):
        color = HEART_FULL_COLOR if i < game_state.lives else HEART_EMPTY_COLOR
        heart_x = hearts_left + i * (HEART_SIZE + 12)
        draw_heart(screen, (heart_x, heart_y), HEART_SIZE, color)

    # Score (small star icon + "score / target") with a progress bar beneath it (center).
    score_text = f"{game_state.score} / {SCORE_TO_LEVEL_COMPLETE}"
    score_label = font_score.render(score_text, True, BLACK)
    bar_left = panel_rect.centerx - PROGRESS_BAR_WIDTH // 2

    star_x = bar_left + 8
    star_y = panel_rect.top + 20
    draw_star(screen, (star_x, star_y), 9, STAR_FILLED_COLOR)
    screen.blit(score_label, (star_x + 16, panel_rect.top + 10))

    bar_bg_rect = pygame.Rect(bar_left, panel_rect.top + 46, PROGRESS_BAR_WIDTH, PROGRESS_BAR_HEIGHT)
    pygame.draw.rect(screen, PROGRESS_BAR_BG_COLOR, bar_bg_rect, border_radius=PROGRESS_BAR_HEIGHT // 2)
    progress = min(game_state.score / SCORE_TO_LEVEL_COMPLETE, 1.0)
    fill_width = int(PROGRESS_BAR_WIDTH * progress)
    if fill_width > 0:
        fill_rect = pygame.Rect(bar_bg_rect.left, bar_bg_rect.top, fill_width, PROGRESS_BAR_HEIGHT)
        pygame.draw.rect(screen, PROGRESS_BAR_FILL_COLOR, fill_rect, border_radius=PROGRESS_BAR_HEIGHT // 2)

    # Level (right side).
    level_label = font_level.render(f"LEVEL {game_state.level} / {MAX_LEVEL}", True, BLACK)
    level_x = panel_rect.right - level_label.get_width() - 40
    screen.blit(level_label, (level_x, panel_rect.centery - level_label.get_height() // 2))


def get_message_group_left(panda_width):
    """Left edge of the whole panda + speech-bubble group, computed so the
    group (panda + tail gap + fixed-width bubble) sits horizontally centered
    on screen, right below the HUD.
    """
    group_width = panda_width + MESSAGE_BOX_TAIL_GAP + MESSAGE_BOX_WIDTH
    return (SCREEN_WIDTH - group_width) // 2


def get_message_rect(panda_right, row_top):
    """The single speech-bubble box to the right of the (bigger, mascot-style)
    panda: idle text, or feedback (icon/title/detail) once something has been
    dropped. Bottom-aligned with the panda so they share one baseline. Fixed
    width (MESSAGE_BOX_WIDTH), so the panda+bubble group can be centered as
    one unit instead of stretching across the screen.
    """
    left = panda_right + MESSAGE_BOX_TAIL_GAP
    bottom = row_top + PANDA_HEADER_HEIGHT
    top = bottom - MESSAGE_BOX_HEIGHT
    return pygame.Rect(left, top, MESSAGE_BOX_WIDTH, MESSAGE_BOX_HEIGHT)


def draw_sparkle(screen, center, size, color):
    """One tiny 4-point sparkle/twinkle accent (a thin diamond cross)."""
    x, y = center
    pygame.draw.polygon(screen, color, [(x, y - size), (x + size // 3, y), (x, y + size), (x - size // 3, y)])
    pygame.draw.polygon(screen, color, [(x - size, y), (x, y - size // 3), (x + size, y), (x, y + size // 3)])


def draw_line_with_highlight(screen, line, font, pos, normal_color, highlight_color, highlight_words):
    """Render one line word-by-word, coloring any word in `highlight_words`
    (matched with surrounding punctuation stripped) differently -- used to
    call out "Panda" in orange within the idle greeting.
    """
    x, y = pos
    space_width = font.size(" ")[0]
    for word in line.split(" "):
        bare = word.strip("!.,?")
        color = highlight_color if bare in highlight_words else normal_color
        word_surface = font.render(word, True, color)
        screen.blit(word_surface, (x, y))
        x += word_surface.get_width() + space_width


def get_food_area_rect(baskets_top, area_top):
    """FOOD_AREA: the large rectangle the falling/draggable food lives in --
    from just below the panda/message row down to just above the baskets,
    using nearly the full screen width (same side margins as the HUD above it).
    """
    top = area_top
    bottom = baskets_top - 8
    left = MESSAGE_BOX_SIDE_MARGIN
    right = SCREEN_WIDTH - MESSAGE_BOX_SIDE_MARGIN
    return pygame.Rect(left, top, right - left, bottom - top)


def draw_drop_here_indicator(screen, basket, font):
    """Small "Drop Here!" pill shown just above a basket while the player is
    actively dragging food over it -- makes the valid drop target obvious.
    """
    text_surface = font.render(DROP_HERE_TEXT, True, DROP_HERE_TEXT_COLOR)
    pill_rect = pygame.Rect(0, 0, text_surface.get_width() + 24, text_surface.get_height() + 10)
    pill_rect.midbottom = (basket.rect.centerx, basket.rect.top - 12)

    pygame.draw.rect(screen, DROP_HERE_BG_COLOR, pill_rect, border_radius=pill_rect.height // 2)
    screen.blit(text_surface, (pill_rect.centerx - text_surface.get_width() // 2,
                                pill_rect.centery - text_surface.get_height() // 2))


class FloatingScorePopup:
    """A small "+10" label that rises and fades out from where a correct
    answer was dropped. Purely decorative -- created, updated and drawn
    without affecting scoring, timing, or any other gameplay logic."""

    def __init__(self, text, pos, started_at_ms):
        self.text = text
        self.pos = pos
        self.started_at_ms = started_at_ms

    def is_expired(self, now_ms):
        return now_ms - self.started_at_ms >= FLOATING_SCORE_DURATION_MS

    def draw(self, screen, font, now_ms):
        progress = min(max((now_ms - self.started_at_ms) / FLOATING_SCORE_DURATION_MS, 0.0), 1.0)
        y_offset = -FLOATING_SCORE_RISE_PX * progress
        alpha = int(255 * (1.0 - progress))

        text_surface = font.render(self.text, True, FLOATING_SCORE_COLOR)
        star_size = 12
        combo_surface = pygame.Surface(
            (star_size * 2 + 6 + text_surface.get_width(), max(star_size * 2, text_surface.get_height())),
            pygame.SRCALPHA,
        )
        draw_star(combo_surface, (star_size, combo_surface.get_height() // 2), star_size, STAR_FILLED_COLOR)
        combo_surface.blit(text_surface, (star_size * 2 + 6, combo_surface.get_height() // 2 - text_surface.get_height() // 2))
        combo_surface.set_alpha(alpha)

        rect = combo_surface.get_rect(center=(self.pos[0], self.pos[1] + y_offset))
        screen.blit(combo_surface, rect)


class DisappearingFood:
    """A quick shrink + fade transition for the food that was just sorted
    correctly, so it disappears smoothly instead of just vanishing the
    instant the next food spawns. Purely decorative -- drawn independently
    of `current_food`, never affects scoring, timing, or spawn logic."""

    def __init__(self, image, rect, started_at_ms):
        self.image = image
        self.rect = rect
        self.started_at_ms = started_at_ms

    def is_expired(self, now_ms):
        return now_ms - self.started_at_ms >= FOOD_DISAPPEAR_DURATION_MS

    def draw(self, screen, now_ms):
        progress = min(max((now_ms - self.started_at_ms) / FOOD_DISAPPEAR_DURATION_MS, 0.0), 1.0)
        scale = 1.0 - 0.4 * progress
        alpha = int(255 * (1.0 - progress))

        size = (max(1, int(self.image.get_width() * scale)), max(1, int(self.image.get_height() * scale)))
        shrunk = pygame.transform.smoothscale(self.image, size)
        shrunk.set_alpha(alpha)
        rect = shrunk.get_rect(center=self.rect.center)
        screen.blit(shrunk, rect)


def draw_tutorial_hint_arrow(screen, area_rect, now_ms, hint_until_ms):
    """Small bouncing arrow pointing down toward the baskets, shown only
    during the Level-1 tutorial hint window. Fades out in its last
    TUTORIAL_HINT_FADE_MS instead of popping off abruptly.
    """
    remaining = hint_until_ms - now_ms
    if remaining <= 0:
        return
    alpha = 255 if remaining > TUTORIAL_HINT_FADE_MS else int(255 * remaining / TUTORIAL_HINT_FADE_MS)

    bob = abs(math.sin((now_ms % 700) / 700 * math.pi)) * 8
    cx = area_rect.centerx
    cy = area_rect.top + int(area_rect.height * 0.66) + int(bob)

    arrow_surface = pygame.Surface((40, 44), pygame.SRCALPHA)
    pygame.draw.rect(arrow_surface, TUTORIAL_HINT_ARROW_COLOR, (14, 0, 12, 20), border_radius=4)
    pygame.draw.polygon(arrow_surface, TUTORIAL_HINT_ARROW_COLOR, [(2, 16), (38, 16), (20, 40)])
    arrow_surface.set_alpha(max(0, min(255, alpha)))
    rect = arrow_surface.get_rect(center=(cx, cy))
    screen.blit(arrow_surface, rect)


def draw_food_area_decorations(screen, area_rect):
    """A handful of tiny, very low-contrast circles floating in the food
    area (drawn straight onto the background, no backdrop panel behind
    them), so the large open sky doesn't feel completely bare. Fixed
    relative positions -- purely cosmetic, never overlaps or competes with
    the food itself.
    """
    relative_spots = [
        (0.08, 0.15, 10), (0.92, 0.18, 8), (0.15, 0.85, 7),
        (0.88, 0.82, 9), (0.5, 0.92, 6), (0.05, 0.5, 6),
    ]
    for rel_x, rel_y, radius in relative_spots:
        center = (area_rect.left + int(area_rect.width * rel_x), area_rect.top + int(area_rect.height * rel_y))
        pygame.draw.circle(screen, FOOD_AREA_DECORATION_COLOR, center, radius)


def wrap_text(text, font, max_width):
    """Split text into lines that each fit within max_width for the given font."""
    words = text.split(" ")
    lines = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if font.size(candidate)[0] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_top_message_box(screen, panda, idle_font, feedback_fonts, message_rect, panda_message, feedback):
    """The single message/feedback system: a big, friendly panda on the left
    (drawn separately by the caller via panda.draw()) with a rounded speech
    bubble -- tail pointing back at the panda -- to its right, showing either
    the idle prompt or the active correct/wrong feedback (icon + title +
    detail, one line). There is only ever one message box on screen.
    `feedback` is None (idle) or (title, detail, is_correct, alpha).
    """
    font_feedback_title, font_feedback_detail = feedback_fonts

    # Soft drop shadow, slightly offset, for a bit of depth under the bubble.
    shadow_surface = pygame.Surface(message_rect.size, pygame.SRCALPHA)
    pygame.draw.rect(shadow_surface, MESSAGE_BOX_SHADOW_COLOR, shadow_surface.get_rect(), border_radius=28)
    screen.blit(shadow_surface, message_rect.move(3, 6))

    # Tail: a small cascade of shrinking circles trailing from the bubble
    # back toward the panda -- softer and cuter than a hard-edged triangle.
    # Kept short (MESSAGE_BOX_TAIL_GAP is only ~22px) so it never reaches
    # past the panda. Drawn before the main box so its left edge cleanly
    # overlaps them.
    tail_y = message_rect.centery + 6
    pygame.draw.circle(screen, MESSAGE_BOX_COLOR, (message_rect.left - 1, tail_y), 10)
    pygame.draw.circle(screen, MESSAGE_BOX_BORDER_COLOR, (message_rect.left - 1, tail_y), 10, width=2)
    pygame.draw.circle(screen, MESSAGE_BOX_COLOR, (message_rect.left - 12, tail_y + 8), 5)
    pygame.draw.circle(screen, MESSAGE_BOX_BORDER_COLOR, (message_rect.left - 12, tail_y + 8), 5, width=2)

    pygame.draw.rect(screen, MESSAGE_BOX_COLOR, message_rect, border_radius=28)
    pygame.draw.rect(screen, MESSAGE_BOX_BORDER_COLOR, message_rect, width=3, border_radius=28)

    if feedback is not None:
        title, detail, is_correct, alpha = feedback
        tint_color = FEEDBACK_CARD_CORRECT_BG if is_correct else FEEDBACK_CARD_WRONG_BG
        accent_color = FEEDBACK_CARD_CORRECT_BORDER if is_correct else FEEDBACK_CARD_WRONG_BORDER

        # The colored tint fades in/out with the feedback rather than
        # snapping instantly, so the box doesn't flash.
        tint_surface = pygame.Surface(message_rect.size, pygame.SRCALPHA)
        tint_local_rect = tint_surface.get_rect()
        pygame.draw.rect(tint_surface, tint_color, tint_local_rect, border_radius=28)
        pygame.draw.rect(tint_surface, accent_color, tint_local_rect, width=3, border_radius=28)
        tint_surface.set_alpha(alpha)
        screen.blit(tint_surface, message_rect)

    content_left = message_rect.left + 26
    content_right = message_rect.right - 24

    if feedback is not None:
        title, detail, is_correct, alpha = feedback
        accent_color = FEEDBACK_CARD_CORRECT_BORDER if is_correct else FEEDBACK_CARD_WRONG_BORDER

        icon_size = 34
        icon_surface = pygame.Surface((icon_size, icon_size), pygame.SRCALPHA)
        icon_center = (icon_size // 2, icon_size // 2)
        if is_correct:
            draw_star(icon_surface, icon_center, 15, STAR_FILLED_COLOR)
        else:
            x, y = icon_center
            pygame.draw.line(icon_surface, accent_color, (x - 9, y - 9), (x + 9, y + 9), 5)
            pygame.draw.line(icon_surface, accent_color, (x - 9, y + 9), (x + 9, y - 9), 5)
        icon_surface.set_alpha(alpha)
        icon_rect = icon_surface.get_rect(midleft=(content_left, message_rect.centery))
        screen.blit(icon_surface, icon_rect)

        title_surface = font_feedback_title.render(title, True, FEEDBACK_TITLE_COLOR)
        detail_surface = font_feedback_detail.render(detail, True, FEEDBACK_DETAIL_COLOR)
        title_surface.set_alpha(alpha)
        detail_surface.set_alpha(alpha)
        text_left = icon_rect.right + 14
        screen.blit(title_surface, (text_left, message_rect.centery - title_surface.get_height() // 2))
        detail_left = text_left + title_surface.get_width() + 14
        screen.blit(detail_surface, (detail_left, message_rect.centery - detail_surface.get_height() // 2))
    else:
        lines = wrap_text(panda_message, idle_font, content_right - content_left)
        line_height = idle_font.get_height()
        total_height = line_height * len(lines)
        text_y = message_rect.centery - total_height // 2
        for line in lines:
            draw_line_with_highlight(
                screen, line, idle_font, (content_left, text_y),
                MESSAGE_BOX_TEXT_COLOR, MESSAGE_BOX_HIGHLIGHT_COLOR, {"Panda"},
            )
            text_y += line_height

        # A couple of tiny sparkle accents near the panda's paw, purely decorative.
        draw_sparkle(screen, (message_rect.left - 24, message_rect.top + 14), 7, SPARKLE_COLOR)

    # The panda is drawn last so it sits crisply on top of the bubble's tail.
    panda.draw(screen)


def pick_message(messages, previous=None):
    """Pick a random message from the list, avoiding an immediate repeat when possible."""
    choices = [m for m in messages if m != previous] if len(messages) > 1 else messages
    return random.choice(choices)


def _get_result_screen_button_rect():
    """The one shared button position/size used on all 3 end-of-round screens
    (Game Over, Level Complete, Game Complete).
    """
    rect = pygame.Rect(0, 0, PLAY_AGAIN_BUTTON_WIDTH, PLAY_AGAIN_BUTTON_HEIGHT)
    rect.center = (SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 190)
    return rect


def get_play_again_button_rect():
    """The clickable area of the PLAY AGAIN button (Game Over / Game Complete screens)."""
    return _get_result_screen_button_rect()


def get_next_level_button_rect():
    """The clickable area of the NEXT LEVEL button on the Level Complete screen."""
    return _get_result_screen_button_rect()


def start_new_game(game_state, base_dir):
    """PLAY AGAIN: reset score/lives/level and spawn a fresh falling food."""
    game_state.reset_game()
    return spawn_falling_food(base_dir, game_state.level)


def start_next_level(game_state, base_dir):
    """NEXT LEVEL: advance the level, reset score to 0, spawn a fresh falling food."""
    game_state.next_level()
    return spawn_falling_food(base_dir, game_state.level)


def draw_result_card(
    screen, panda, game_state, button_rect, mouse_pos, fonts,
    bg_color, card_color, card_border_color,
    subtitle_text, score_text, score_y_offset, button_label, show_stars,
):
    """Shared layout for the 3 end-of-round screens (Game Over, Level Complete,
    Game Complete): a centered card with the title, the panda, a subtitle, the
    score, an optional star rating, and one action button. Each screen only
    differs in its colors, text, and whether it shows stars -- see the small
    wrapper functions below.
    """
    font_title, font_subtitle, font_score, font_button = fonts

    screen.fill(bg_color)

    card_rect = pygame.Rect(0, 0, 640, 520)
    card_rect.center = (SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 20)
    pygame.draw.rect(screen, card_color, card_rect, border_radius=30)
    pygame.draw.rect(screen, card_border_color, card_rect, width=6, border_radius=30)

    title_surface = font_title.render("PandaBite", True, ORANGE)
    screen.blit(title_surface, (card_rect.centerx - title_surface.get_width() // 2, card_rect.top + 30))

    panda_rect = panda.image.get_rect(center=(card_rect.centerx, card_rect.top + 190))
    screen.blit(panda.image, panda_rect)

    subtitle_surface = font_subtitle.render(subtitle_text, True, BLACK)
    screen.blit(
        subtitle_surface, (card_rect.centerx - subtitle_surface.get_width() // 2, card_rect.top + 300)
    )

    score_surface = font_score.render(score_text, True, BLACK)
    screen.blit(
        score_surface, (card_rect.centerx - score_surface.get_width() // 2, card_rect.top + score_y_offset)
    )

    if show_stars:
        draw_star_rating(screen, card_rect.centerx, card_rect.top + 405, game_state.star_rating())

    button_color = PLAY_AGAIN_BUTTON_HOVER_COLOR if button_rect.collidepoint(mouse_pos) else PLAY_AGAIN_BUTTON_COLOR
    pygame.draw.rect(screen, button_color, button_rect, border_radius=20)
    button_surface = font_button.render(button_label, True, WHITE)
    button_x = button_rect.centerx - button_surface.get_width() // 2
    button_y = button_rect.centery - button_surface.get_height() // 2
    screen.blit(button_surface, (button_x, button_y))


def draw_game_over_screen(screen, panda, game_state, play_again_rect, mouse_pos, fonts):
    draw_result_card(
        screen, panda, game_state, play_again_rect, mouse_pos, fonts,
        bg_color=GAME_OVER_BG_COLOR, card_color=GAME_OVER_CARD_COLOR, card_border_color=ORANGE,
        subtitle_text="Great Try!", score_text=f"Your Score: {game_state.score}",
        score_y_offset=350, button_label="PLAY AGAIN", show_stars=False,
    )


def draw_level_complete_screen(screen, panda, game_state, next_level_rect, mouse_pos, fonts):
    draw_result_card(
        screen, panda, game_state, next_level_rect, mouse_pos, fonts,
        bg_color=LEVEL_COMPLETE_BG_COLOR, card_color=LEVEL_COMPLETE_CARD_COLOR, card_border_color=GREEN,
        subtitle_text="Level Complete!", score_text=f"Level {game_state.level} Score: {game_state.score}",
        score_y_offset=345, button_label="NEXT LEVEL", show_stars=True,
    )


def draw_game_complete_screen(screen, panda, game_state, play_again_rect, mouse_pos, fonts):
    """Shown after the player clears the final level (MAX_LEVEL)."""
    draw_result_card(
        screen, panda, game_state, play_again_rect, mouse_pos, fonts,
        bg_color=GAME_COMPLETE_BG_COLOR, card_color=GAME_COMPLETE_CARD_COLOR, card_border_color=YELLOW,
        subtitle_text="You Win!", score_text=f"Final Score: {game_state.score}",
        score_y_offset=345, button_label="PLAY AGAIN", show_stars=True,
    )


def handle_correct_sort(game_state, panda, sfx_correct=None):
    """Apply the effects of a correct sort. Returns (title, detail, is_correct) for the feedback card."""
    game_state.add_score()
    panda.set_happy()
    play_sound(sfx_correct)
    return "Great Job!", f"+{POINTS_PER_CORRECT} Points", True


def handle_wrong_sort(game_state, panda, food, baskets, sfx_wrong=None):
    """Apply the effects of a wrong sort. Returns (title, detail, is_correct) for the feedback card.
    `food` and its `.group` are the actual food that was just dropped -- never hardcoded --
    so the detail line always names the real food and its real basket (e.g. "Fish -> Body-Building Foods").
    """
    game_state.lose_life()
    panda.set_sad()
    food.reset_position()
    play_sound(sfx_wrong)
    correct_basket = find_basket_by_group(baskets, food.group)
    correct_basket.show_hint(BASKET_HINT_DURATION_MS)
    detail = f"{food.name} → {correct_basket.name}"
    return "Try Again!", detail, False


def main():
    pygame.init()

    # DOUBLEBUF avoids tearing (a frame being drawn while it's still being
    # displayed), which can look like the food is stuttering during a fast drag.
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.DOUBLEBUF)
    pygame.display.set_caption(WINDOW_TITLE)
    clock = pygame.time.Clock()

    background = load_background(SCREEN_WIDTH, SCREEN_HEIGHT)
    baskets = create_baskets(SCREEN_WIDTH, SCREEN_HEIGHT, BASE_DIR)
    baskets_top = min(basket.rect.top for basket in baskets)

    # HUD (score bar) is the very top row. Below it, the big panda mascot +
    # its single speech-bubble message box sit centered as one group. This
    # row is well above the food area and the baskets, so it can never
    # overlap either.
    hud_top = HUD_TOP
    message_row_top = hud_top + HUD_PANEL_HEIGHT + MESSAGE_ROW_GAP

    panda_bottom_y = message_row_top + PANDA_HEADER_HEIGHT
    panda = Panda(BASE_DIR, 0, panda_bottom_y, height=PANDA_HEADER_HEIGHT)
    panda_half_width = max(frame.get_width() for frames in panda.frames.values() for frame in frames) // 2
    group_left = get_message_group_left(panda_half_width * 2)
    panda.x = group_left + panda_half_width
    panda.rect.midbottom = (panda.x, panda.y)

    message_rect = get_message_rect(panda.rect.right, message_row_top)
    play_area_top = max(message_rect.bottom, panda.rect.bottom) + 8

    game_state = GameState()
    food_area_rect = get_food_area_rect(baskets_top, play_area_top)

    music_playing = start_background_music()
    sfx_correct = load_sound_effect(SFX_CATCH_CORRECT)
    sfx_wrong = load_sound_effect(SFX_CATCH_WRONG)
    sfx_level_complete = load_sound_effect(SFX_LEVEL_COMPLETE)
    sfx_click = load_sound_effect(SFX_CLICK)

    # One food at a time, falling from near the top of the play area.
    current_food = spawn_falling_food(BASE_DIR, game_state.level)

    font_message = pygame.font.SysFont("Arial", 20)
    font_hud_title = pygame.font.SysFont("Arial", 22, bold=True)
    font_hud_score = pygame.font.SysFont("Arial", 20, bold=True)
    font_hud_level = pygame.font.SysFont("Arial", 20, bold=True)
    hud_fonts = (font_hud_title, font_hud_score, font_hud_level)
    font_feedback_title = pygame.font.SysFont("Arial", 24, bold=True)
    font_feedback_detail = pygame.font.SysFont("Arial", 18)
    feedback_fonts = (font_feedback_title, font_feedback_detail)
    font_drop_here = pygame.font.SysFont("Arial", 16, bold=True)
    font_floating_score = pygame.font.SysFont("Arial", 24, bold=True)
    font_pause = pygame.font.SysFont("Arial", 54, bold=True)
    font_pause_hint = pygame.font.SysFont("Arial", 26)

    # Small "+10" popups that float up from a correct drop and fade out.
    # Purely decorative -- see FloatingScorePopup.
    floating_popups = []

    # Foods that were just sorted correctly, mid shrink-and-fade transition.
    # Purely decorative -- see DisappearingFood.
    disappearing_foods = []

    # Game Over / Level Complete screen fonts share the same sizes + the fixed button area
    font_over_title = pygame.font.SysFont("Arial", 56, bold=True)
    font_over_subtitle = pygame.font.SysFont("Arial", 34, bold=True)
    font_over_score = pygame.font.SysFont("Arial", 30)
    font_over_button = pygame.font.SysFont("Arial", 32, bold=True)
    game_over_fonts = (font_over_title, font_over_subtitle, font_over_score, font_over_button)
    play_again_rect = get_play_again_button_rect()
    next_level_rect = get_next_level_button_rect()

    # Feedback shown in the top message box after a drop ("Great Job! +10
    # Points" / "Try Again! <food> -> <basket>"), cleared after FEEDBACK_DURATION_MS.
    feedback_title = None
    feedback_detail = None
    feedback_is_correct = True
    feedback_shown_at_ms = 0
    feedback_until_ms = 0

    # Timestamp of the most recent pause, used to shift feedback_until_ms by
    # however long the pause lasted -- otherwise real time keeps passing while
    # paused and the feedback message would vanish the instant you resume.
    pause_started_ms = 0

    # The panda's speech-bubble line. Picked fresh (from the list matching its
    # current mood) each time the mood changes, so it doesn't always say the same thing.
    panda_message = pick_message(MESSAGE_TEXTS_IDLE)

    # One-time Level-1 tutorial hint: replaces the idle line for the first
    # few seconds of a fresh game, or until the player starts their first
    # drag -- whichever comes first. Once dismissed it stays dismissed for
    # the rest of this run (including through Play Again / Next Level).
    tutorial_hint_dismissed = game_state.level != 1
    tutorial_hint_until_ms = pygame.time.get_ticks() + TUTORIAL_HINT_DURATION_MS
    if not tutorial_hint_dismissed:
        panda_message = TUTORIAL_HINT_TEXT

    # Debug overlay (press D to toggle): shows FPS, mouse position, and the
    # dragged food's position/offset, to diagnose reports of drag lag/misalignment.
    font_debug = pygame.font.SysFont("Consolas", 18)
    debug_overlay = False

    running = True
    while running:
        # --- Handle events ---
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                game_state.toggle_pause()

                if game_state.state == PAUSED:
                    # Stop food interaction immediately: cancel any in-progress
                    # drag so it can't be dropped while paused.
                    if current_food.dragging:
                        current_food.dragging = False
                        current_food.reset_position()
                    if music_playing:
                        pygame.mixer.music.pause()
                    pause_started_ms = pygame.time.get_ticks()
                elif game_state.state == PLAYING:
                    if music_playing:
                        pygame.mixer.music.unpause()
                    # Push the feedback card's expiry back by however long
                    # we were paused, so it still shows for its full duration.
                    if feedback_title:
                        paused_duration = pygame.time.get_ticks() - pause_started_ms
                        feedback_until_ms += paused_duration
                        feedback_shown_at_ms += paused_duration

            elif event.type == pygame.KEYDOWN and event.key == pygame.K_d:
                debug_overlay = not debug_overlay

            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                if game_state.state == GAME_OVER:
                    if play_again_rect.collidepoint(event.pos):
                        play_sound(sfx_click)
                        current_food = start_new_game(game_state, BASE_DIR)
                        feedback_title = None
                        panda.set_idle()
                        panda_message = pick_message(MESSAGE_TEXTS_IDLE, panda_message)

                elif game_state.state == LEVEL_COMPLETE:
                    if next_level_rect.collidepoint(event.pos):
                        play_sound(sfx_click)
                        current_food = start_next_level(game_state, BASE_DIR)
                        feedback_title = None
                        panda.set_idle()
                        panda_message = pick_message(MESSAGE_TEXTS_IDLE, panda_message)

                elif game_state.state == GAME_COMPLETE:
                    if play_again_rect.collidepoint(event.pos):
                        play_sound(sfx_click)
                        current_food = start_new_game(game_state, BASE_DIR)
                        feedback_title = None
                        panda.set_idle()
                        panda_message = pick_message(MESSAGE_TEXTS_IDLE, panda_message)

                elif game_state.is_playing() and not current_food.dragging:
                    if current_food.rect.collidepoint(event.pos):
                        feedback_title = None
                        current_food.start_drag(event.pos)
                        if not tutorial_hint_dismissed:
                            tutorial_hint_dismissed = True
                            panda_message = pick_message(MESSAGE_TEXTS_IDLE, panda_message)

            elif event.type == pygame.MOUSEBUTTONUP and event.button == 1:
                if current_food.dragging and game_state.is_playing():
                    current_food.dragging = False

                    dropped_basket = find_dropped_basket(baskets, current_food.rect)

                    if dropped_basket is None:
                        # Missed the baskets: snap back to the top and resume falling.
                        current_food.reset_position()
                    elif current_food.group == dropped_basket.group:
                        now_ms = pygame.time.get_ticks()
                        floating_popups.append(FloatingScorePopup(
                            f"+{POINTS_PER_CORRECT}", current_food.rect.center, now_ms
                        ))
                        disappearing_foods.append(DisappearingFood(
                            current_food.image, current_food.rect.copy(), now_ms
                        ))
                        feedback_title, feedback_detail, feedback_is_correct = handle_correct_sort(
                            game_state, panda, sfx_correct
                        )
                        feedback_shown_at_ms = now_ms
                        feedback_until_ms = feedback_shown_at_ms + FEEDBACK_DURATION_MS
                        panda_message = pick_message(MESSAGE_TEXTS_HAPPY, panda_message)
                        if game_state.state in (LEVEL_COMPLETE, GAME_COMPLETE):
                            play_sound(sfx_level_complete)
                        current_food = spawn_falling_food(BASE_DIR, game_state.level)
                    else:
                        feedback_title, feedback_detail, feedback_is_correct = handle_wrong_sort(
                            game_state, panda, current_food, baskets, sfx_wrong
                        )
                        feedback_shown_at_ms = pygame.time.get_ticks()
                        feedback_until_ms = feedback_shown_at_ms + FEEDBACK_DURATION_MS
                        panda_message = pick_message(MESSAGE_TEXTS_SAD, panda_message)

        # --- Update ---
        mouse_pos = pygame.mouse.get_pos()

        # Nothing moves/animates while PAUSED (or GAME_OVER / LEVEL_COMPLETE).
        if game_state.is_playing():
            if current_food.dragging:
                # Follow the mouse every frame (not just on motion events) for smooth dragging.
                current_food.drag_to(mouse_pos)
                for basket in baskets:
                    basket.check_rect_hover(current_food.rect, current_food.group == basket.group)
            else:
                current_food.fall()
                for basket in baskets:
                    basket.check_hover(mouse_pos)

                # Reached the baskets without being sorted: counts as a miss.
                if current_food.rect.centery >= baskets_top:
                    feedback_title, feedback_detail, feedback_is_correct = handle_wrong_sort(
                        game_state, panda, current_food, baskets, sfx_wrong
                    )
                    feedback_shown_at_ms = pygame.time.get_ticks()
                    feedback_until_ms = feedback_shown_at_ms + FEEDBACK_DURATION_MS
                    panda_message = pick_message(MESSAGE_TEXTS_SAD, panda_message)
                    current_food = spawn_falling_food(BASE_DIR, game_state.level)

            panda.update()

            # Clear the feedback card (and the panda's mood) once it's been shown long enough.
            if feedback_title and pygame.time.get_ticks() >= feedback_until_ms:
                feedback_title = None
                panda.set_idle()
                panda_message = pick_message(MESSAGE_TEXTS_IDLE, panda_message)

            # Auto-dismiss the tutorial hint once its window has elapsed, even
            # if the player never interacted (it just quietly reverts).
            if not tutorial_hint_dismissed and pygame.time.get_ticks() >= tutorial_hint_until_ms:
                tutorial_hint_dismissed = True
                if not feedback_title:
                    panda_message = pick_message(MESSAGE_TEXTS_IDLE, panda_message)

        # --- Draw ---
        if game_state.state == GAME_OVER:
            # Game Over replaces normal gameplay entirely.
            draw_game_over_screen(screen, panda, game_state, play_again_rect, mouse_pos, game_over_fonts)
        elif game_state.state == LEVEL_COMPLETE:
            # Level Complete also replaces normal gameplay entirely.
            draw_level_complete_screen(screen, panda, game_state, next_level_rect, mouse_pos, game_over_fonts)
        elif game_state.state == GAME_COMPLETE:
            # Shown once after clearing the final level.
            draw_game_complete_screen(screen, panda, game_state, play_again_rect, mouse_pos, game_over_fonts)
        else:
            if background:
                screen.blit(background, (0, 0))
            else:
                screen.fill(WHITE)

            # No backdrop panel here on purpose: the food falls straight against
            # the background art (sky/scenery), not inside a white box, so it
            # actually reads as falling from the sky. A few faint decorative
            # specks still float in this region for a little ambient life.
            draw_food_area_decorations(screen, food_area_rect)

            for basket in baskets:
                basket.draw(screen)

            now_ms = pygame.time.get_ticks()
            disappearing_foods = [f for f in disappearing_foods if not f.is_expired(now_ms)]
            for fading_food in disappearing_foods:
                fading_food.draw(screen, now_ms)

            current_food.draw(screen)

            # While actively dragging, make the hovered basket's drop target obvious.
            if current_food.dragging:
                for basket in baskets:
                    if basket.is_hovered:
                        draw_drop_here_indicator(screen, basket, font_drop_here)

            if not tutorial_hint_dismissed:
                draw_tutorial_hint_arrow(screen, food_area_rect, now_ms, tutorial_hint_until_ms)

            floating_popups = [p for p in floating_popups if not p.is_expired(now_ms)]
            for popup in floating_popups:
                popup.draw(screen, font_floating_score, now_ms)

            feedback = None
            if feedback_title:
                now_ms = pygame.time.get_ticks()
                elapsed = now_ms - feedback_shown_at_ms
                remaining = feedback_until_ms - now_ms
                alpha = 255
                if elapsed < FEEDBACK_FADE_MS:
                    alpha = int(255 * elapsed / FEEDBACK_FADE_MS)
                elif remaining < FEEDBACK_FADE_MS:
                    alpha = int(255 * max(remaining, 0) / FEEDBACK_FADE_MS)
                feedback = (feedback_title, feedback_detail, feedback_is_correct, max(0, min(255, alpha)))

            draw_top_message_box(
                screen, panda, font_message, feedback_fonts, message_rect, panda_message, feedback
            )

            draw_hud(screen, game_state, hud_fonts, hud_top)

            if debug_overlay:
                offset = (current_food.rect.x - mouse_pos[0], current_food.rect.y - mouse_pos[1])
                debug_lines = [
                    f"FPS: {clock.get_fps():.0f}",
                    f"Mouse: {mouse_pos}",
                    f"Food rect: {current_food.rect.topleft}",
                    f"Dragging: {current_food.dragging}  Offset: {offset}",
                ]
                box_rect = pygame.Rect(10, SCREEN_HEIGHT - 110, 320, 100)
                box_surface = pygame.Surface(box_rect.size, pygame.SRCALPHA)
                box_surface.fill((0, 0, 0, 180))
                screen.blit(box_surface, box_rect)
                for i, line in enumerate(debug_lines):
                    line_surface = font_debug.render(line, True, WHITE)
                    screen.blit(line_surface, (box_rect.left + 10, box_rect.top + 8 + i * 22))

            if game_state.state == PAUSED:
                overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
                overlay.fill((0, 0, 0, 150))
                screen.blit(overlay, (0, 0))

                pause_surface = font_pause.render("PAUSED", True, WHITE)
                pause_x = SCREEN_WIDTH // 2 - pause_surface.get_width() // 2
                screen.blit(pause_surface, (pause_x, SCREEN_HEIGHT // 2 - 60))

                hint_surface = font_pause_hint.render("Press ESC to Resume", True, WHITE)
                hint_x = SCREEN_WIDTH // 2 - hint_surface.get_width() // 2
                screen.blit(hint_surface, (hint_x, SCREEN_HEIGHT // 2 + 10))

        pygame.display.flip()
        clock.tick(FPS)

    if sys.platform == "win32":
        try:
            ctypes.windll.winmm.timeEndPeriod(1)
        except (AttributeError, OSError):
            pass

    pygame.quit()


if __name__ == "__main__":
    main()
