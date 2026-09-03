# Game window settings
SCREEN_WIDTH = 1280
SCREEN_HEIGHT = 720
FPS = 60
WINDOW_TITLE = "PandaBite"

# Background image file (place inside assets/images/)
BACKGROUND_IMAGE = "background.png"

# Background music and sound effects (place inside assets/sounds/). All
# optional -- if a file isn't there, the game just runs silently, no crash.
BACKGROUND_MUSIC = "bgm.wav"
BACKGROUND_MUSIC_VOLUME = 0.5

SFX_CATCH_CORRECT = "catch_correct.wav"
SFX_CATCH_WRONG = "catch_wrong.wav"
SFX_LEVEL_COMPLETE = "level_complete.wav"
SFX_CLICK = "click.wav"
SFX_VOLUME = 0.7

# Basket images (place inside assets/images/)
ENERGY_BASKET_IMAGE = "energy_basket.png"
BODY_BASKET_IMAGE = "body_basket.png"
PROTECTIVE_BASKET_IMAGE = "protective_basket.png"

# Basket size/layout. Kept small enough to leave a large open middle area for
# the food, while staying comfortably clickable/drag-droppable for kids.
BASKET_WIDTH = 132
BASKET_BOTTOM_MARGIN = 90  # distance from the bottom of the screen (leaves ~25-30px under the 2-line label)
BASKET_HIGHLIGHT_COLOR = (255, 215, 0)  # gold border shown on hover
BASKET_HIGHLIGHT_GLOW_COLOR = (255, 215, 0, 90)  # soft glow behind a hovered basket
BASKET_LABEL_BG_COLOR = (255, 255, 255)
BASKET_LABEL_HOVER_BG_COLOR = (255, 247, 214)  # warm tint the label pill gets while hovered, for extra emphasis
BASKET_HOVER_SCALE = 1.05  # subtle "lift" applied to a basket's image while something is dragged over it

# "Drop Here" hint shown above a basket while food is actively being dragged over it.
DROP_HERE_TEXT = "Drop Here!"
DROP_HERE_BG_COLOR = (255, 215, 0)
DROP_HERE_TEXT_COLOR = (80, 60, 10)

# While dragging, the basket under the food is highlighted -- but the CORRECT
# basket for the food currently being dragged gets a visibly stronger "yes!"
# treatment (bigger glow/scale + sparkle + brighter label) than a basket that
# merely has the food over it but is the wrong group. Never shown before a
# drag starts, so the answer is never revealed early.
BASKET_CORRECT_DRAG_GLOW_COLOR = (140, 230, 130, 150)
BASKET_CORRECT_DRAG_BORDER_COLOR = (70, 195, 90)
BASKET_CORRECT_DRAG_SPARKLE_COLOR = (255, 225, 90)
BASKET_CORRECT_DRAG_SCALE = 1.09
BASKET_LABEL_CORRECT_BG_COLOR = (225, 250, 225)

# Gentle highlight shown on the correct basket for a moment after a wrong
# answer -- a soft teaching hint, distinct (paler) from the gold drag-hover
# highlight so it never looks like the same "you're hovering it" signal.
BASKET_HINT_COLOR = (190, 220, 255)
BASKET_HINT_GLOW_COLOR = (190, 220, 255, 90)
BASKET_HINT_DURATION_MS = 1000

# HUD row sits at the very top of the screen.
HUD_TOP = 10

# Single combined message system, centered as one group below the HUD: one
# big, friendly panda (its head pokes up above the box, like a mascot leaning
# into frame) with a rounded speech-bubble box -- tail pointing back at the
# panda -- to its right, showing either the idle prompt or the active
# correct/wrong feedback (icon + title + detail, all on one row). One
# persistent panel, never two separate boxes.
MESSAGE_ROW_GAP = 16  # gap between the HUD's bottom edge and this row
PANDA_HEADER_HEIGHT = 108  # big and friendly, like a mascot -- taller than the bubble on purpose
MESSAGE_BOX_HEIGHT = 92
MESSAGE_BOX_WIDTH = 640  # fixed content width (not stretched full-screen), so the group can be centered
MESSAGE_BOX_COLOR = (255, 255, 255)
MESSAGE_BOX_BORDER_COLOR = (255, 200, 190)  # soft coral-pink outline, matching the sky/pink theme
MESSAGE_BOX_SHADOW_COLOR = (60, 30, 20, 40)  # soft drop shadow for a bit of depth
MESSAGE_BOX_TEXT_COLOR = (60, 45, 35)
MESSAGE_BOX_HIGHLIGHT_COLOR = (235, 120, 40)  # used to color the word "Panda" in the idle greeting
MESSAGE_BOX_SIDE_MARGIN = 20  # left/right inset of the HUD/food-area rows from the screen edges
MESSAGE_BOX_TAIL_GAP = 22  # horizontal gap left between the panda and the bubble, for the tail
SPARKLE_COLOR = (255, 200, 60)

# Soft white panel behind the HUD row (title / lives / score / level).
HUD_PANEL_COLOR = (255, 255, 255, 200)

# Speech-bubble messages, grouped by the panda's mood. A random one from the
# matching list is picked each time the mood changes, so the bubble doesn't
# always show the same line.
MESSAGE_TEXTS_IDLE = [
    "Hi! I'm Panda! Drag each food into the right basket to help me grow big and strong!",
    "Let's sort some yummy food together!",
    "Which basket does this food belong in?",
    "I love eating healthy food every day!",
]
MESSAGE_TEXTS_HAPPY = [
    "Yay! You got it right!",
    "Great job! That's exactly right!",
    "Awesome sorting! Keep it up!",
    "You're a food-sorting star!",
]
MESSAGE_TEXTS_SAD = [
    "Oops! Let's try again!",
    "Not quite! Give it another try!",
    "That's okay, mistakes help us learn!",
    "Almost! Try a different basket next time!",
]

# One-time tutorial hint shown in the message box at the very start of Level
# 1 only -- replaces the normal random idle line for a few seconds, then
# reverts (or reverts immediately if the player starts dragging first). Never
# shown again afterward, including on replays via Play Again/Next Level.
TUTORIAL_HINT_TEXT = "Drag the food to the correct basket!"
TUTORIAL_HINT_DURATION_MS = 3000
TUTORIAL_HINT_ARROW_COLOR = (255, 210, 60)
TUTORIAL_HINT_FADE_MS = 400

# Food sprite size (place food images inside assets/images/)
FOOD_IMAGE_WIDTH = 100

# Falling food: one food at a time drifts down from near the top of the play
# area. It pauses while the player drags it, and resumes falling on release.
#
# FOOD_FALL_MARGIN_X (left/right inset from the screen edges), FOOD_FALL_START_Y
# (the topmost spawn y) and FOOD_FALL_START_Y_JITTER (how much further down a
# spawn can additionally land, at random) together define the FOOD_AREA a new
# food can appear in: x roughly [40, SCREEN_WIDTH-40], y from 276 up to 276 +
# 72 -- so a new food can start anywhere from the upper part of the play area
# down to about its lower-middle, not always the same spot, while still
# leaving plenty of "fall runway" above the baskets. Recompute FOOD_FALL_START_Y
# (= HUD bottom + MESSAGE_ROW_GAP + PANDA_HEADER_HEIGHT + gap + half of
# FOOD_IMAGE_WIDTH) if MESSAGE_BOX_HEIGHT, HUD_PANEL_HEIGHT, or FOOD_IMAGE_WIDTH change.
FOOD_FALL_MARGIN_X = 40  # random spawn x is between this and SCREEN_WIDTH - this
FOOD_FALL_START_Y = 276  # topmost possible spawn y, right below the HUD + message row
FOOD_FALL_START_Y_JITTER = 72  # a spawn's y is FOOD_FALL_START_Y + random(0, this)
FOOD_FALL_SPEED = 1.3  # pixels per frame it falls when not being dragged, at level 1
FOOD_FALL_SPEED_INCREMENT = 0.7  # added per level above 1, so later levels fall faster

# Gentle side-to-side rotation while a food falls, so it feels more alive.
# Paused while the food is being dragged, so it never interferes with drag precision.
FOOD_WOBBLE_AMPLITUDE_DEGREES = 12
FOOD_WOBBLE_PERIOD_MS = 1400  # time for one full left-right-left wobble cycle

# Gentle vertical bobbing (purely a drawing offset -- never touches the real
# rect used for falling/collision) layered on top of the fall, so a food that
# hasn't been grabbed yet feels alive instead of just sliding straight down.
FOOD_BOB_AMPLITUDE_PX = 4
FOOD_BOB_PERIOD_MS = 1000

# Drag "lift": while a food is being dragged it's drawn slightly larger (purely
# visual -- the collision rect stays the same size) with a soft shadow under it.
FOOD_DRAG_LIFT_SCALE = 1.06
FOOD_SHADOW_COLOR = (30, 20, 10, 70)

# Quick shrink + fade transition for the food that was just sorted correctly,
# so it disappears smoothly instead of popping out instantly. Purely cosmetic.
FOOD_DISAPPEAR_DURATION_MS = 300

# How long the feedback card ("Great Job!" / "Try Again!") stays on screen,
# and how much of that time is spent fading in/out at each end.
FEEDBACK_DURATION_MS = 1600
FEEDBACK_FADE_MS = 220

# Small "+10" popup that floats up and fades out from wherever a correct
# answer was dropped.
FLOATING_SCORE_COLOR = (80, 180, 100)
FLOATING_SCORE_DURATION_MS = 700
FLOATING_SCORE_RISE_PX = 50

# Very low-contrast decorative shapes (soft circles) scattered inside the food
# area's backdrop panel, so it doesn't feel completely empty. Purely cosmetic,
# fixed positions, no interaction -- the food stays the visual focus.
FOOD_AREA_DECORATION_COLOR = (255, 210, 150, 45)

# Panda animation frames (place inside assets/images/)
# Each state has 2 frames that swap back and forth to create simple motion.
# panda_happy_2.png is excluded: its right paw is clipped off at the image's
# edge (the source art was cropped too tightly), so both happy frames use the
# good artwork (panda_happy_1.png) until a fixed replacement is available.
PANDA_IDLE_FRAMES = ["panda_idle_1.png", "panda_idle_2.png"]
PANDA_HAPPY_FRAMES = ["panda_happy_1.png", "panda_happy_1.png"]
PANDA_SAD_FRAMES = ["panda_sad_1.png", "panda_sad_2.png"]
PANDA_FRAME_DURATION_MS = 400  # how long each animation frame is shown

# Since both happy frames are the same image (see note above), the happy mood
# gets a code-driven bounce instead -- a little repeated hop, purely a
# drawing offset (never touches self.rect, so it can't affect layout).
PANDA_HAPPY_BOUNCE_AMPLITUDE_PX = 12
PANDA_HAPPY_BOUNCE_PERIOD_MS = 380

# HUD row (title / lives / score / progress bar / level) -- drawn directly
# on the background art, no panel behind it.
HUD_PANEL_HEIGHT = 84
HUD_TITLE_TEXT = "PandaBite"
HUD_TITLE_COLOR = (240, 140, 40)
HEART_SIZE = 24
HEART_FULL_COLOR = (220, 60, 60)
HEART_EMPTY_COLOR = (215, 210, 205)
PROGRESS_BAR_BG_COLOR = (225, 220, 210)
PROGRESS_BAR_FILL_COLOR = (80, 180, 100)
PROGRESS_BAR_WIDTH = 200
PROGRESS_BAR_HEIGHT = 14

# Feedback styling shown inside the top message box after each drop
# ("Great Job! +10 Points" / "Try Again! <food> -> <basket>"): a colored tint
# for the box background plus matching icon/text colors.
FEEDBACK_CARD_CORRECT_BG = (225, 245, 226)
FEEDBACK_CARD_CORRECT_BORDER = (80, 180, 100)
FEEDBACK_CARD_WRONG_BG = (255, 230, 228)
FEEDBACK_CARD_WRONG_BORDER = (225, 90, 80)
FEEDBACK_TITLE_COLOR = (50, 40, 35)
FEEDBACK_DETAIL_COLOR = (90, 80, 75)

# Game Over screen
GAME_OVER_BG_COLOR = (255, 235, 205)
GAME_OVER_CARD_COLOR = (255, 250, 240)
PLAY_AGAIN_BUTTON_COLOR = (80, 180, 100)
PLAY_AGAIN_BUTTON_HOVER_COLOR = (100, 205, 120)
PLAY_AGAIN_BUTTON_WIDTH = 320
PLAY_AGAIN_BUTTON_HEIGHT = 80

# Level Complete screen
LEVEL_COMPLETE_BG_COLOR = (222, 245, 224)
LEVEL_COMPLETE_CARD_COLOR = (247, 255, 247)

# Game Complete screen (shown after finishing the final level)
GAME_COMPLETE_BG_COLOR = (255, 245, 200)
GAME_COMPLETE_CARD_COLOR = (255, 250, 235)

# Star rating (shown on the Level Complete / Game Complete screens)
STAR_FILLED_COLOR = (255, 200, 40)
STAR_EMPTY_COLOR = (222, 217, 205)
STAR_SIZE = 26
STAR_SPACING = 60

# Basic colors (R, G, B)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (200, 200, 200)
RED = (220, 60, 60)
GREEN = (80, 180, 100)
BLUE = (80, 140, 220)
ORANGE = (240, 150, 60)
PINK = (240, 120, 160)
YELLOW = (250, 210, 80)
