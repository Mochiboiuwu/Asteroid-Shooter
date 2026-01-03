// Asteroid Shooter Elite - Game Configuration
// Bearbeite diese Werte um Gameplay anzupassen

const GAME_CONFIG = {
    // Player Settings
    PLAYER: {
        SIZE: 30,
        SPEED: 6,
        BOOST_SPEED: 11,
        INITIAL_HEALTH: 100
    },

    // Bullet Settings
    BULLETS: {
        SPEED: 12,
        SIZE: 4,
        COOLDOWN: 60  // ms zwischen Schüssen
    },

    // Asteroid Settings
    ASTEROIDS: {
        INITIAL_SPEED: 2,
        MIN_SIZE: 15,
        MAX_SIZE: 40,
        INITIAL_SPAWN_RATE: 80  // niedriger = häufiger
    },

    // Difficulty Settings
    DIFFICULTY: {
        POINTS_FOR_INCREASE: 500,
        SPEED_INCREASE: 0.05,
        SIZE_INCREASE: 0.3,
        SPAWN_RATE_DECREASE: 3,
        MIN_SPAWN_RATE: 30
    },

    // Canvas Settings
    CANVAS: {
        WIDTH: 1200,
        HEIGHT: 700
    },

    // FPS Settings
    FPS: 60
};
