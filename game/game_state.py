STARTING_LIVES = 3
POINTS_PER_CORRECT = 10
SCORE_TO_LEVEL_COMPLETE = 100
MAX_LEVEL = 3

# Possible values for GameState.state
PLAYING = "PLAYING"
PAUSED = "PAUSED"
LEVEL_COMPLETE = "LEVEL_COMPLETE"
GAME_COMPLETE = "GAME_COMPLETE"  # reached after clearing MAX_LEVEL
GAME_OVER = "GAME_OVER"


class GameState:
    def __init__(self):
        self.score = 0
        self.lives = STARTING_LIVES
        self.level = 1
        self.state = PLAYING  # the game starts directly in PLAYING, no start screen
        self.mistakes_this_level = 0  # tracked for the star rating shown on level complete

    def is_playing(self):
        return self.state == PLAYING

    def add_score(self, points=POINTS_PER_CORRECT):
        """Call when a food is sorted into the right basket."""
        self.score += points
        if self.score >= SCORE_TO_LEVEL_COMPLETE:
            self.state = GAME_COMPLETE if self.level >= MAX_LEVEL else LEVEL_COMPLETE

    def lose_life(self):
        """Call when a food is sorted into the wrong basket."""
        self.lives -= 1
        self.mistakes_this_level += 1
        if self.lives <= 0:
            self.lives = 0
            self.state = GAME_OVER

    def star_rating(self):
        """1-3 stars for how this level went, based on mistakes made."""
        if self.mistakes_this_level == 0:
            return 3
        if self.mistakes_this_level <= 2:
            return 2
        return 1

    def toggle_pause(self):
        """ESC key: PLAYING <-> PAUSED. Has no effect in other states."""
        if self.state == PLAYING:
            self.state = PAUSED
        elif self.state == PAUSED:
            self.state = PLAYING

    def next_level(self):
        """Advance to the next level and go back to PLAYING."""
        self.level += 1
        self.score = 0
        self.mistakes_this_level = 0
        self.state = PLAYING

    def reset_game(self):
        """Start a fresh game from level 1."""
        self.score = 0
        self.lives = STARTING_LIVES
        self.level = 1
        self.mistakes_this_level = 0
        self.state = PLAYING
