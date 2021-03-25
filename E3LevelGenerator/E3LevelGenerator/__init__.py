import numpy as np
from abc import ABC, abstractmethod
from collections import deque

world_bounds = {"w": 1600, "h": 2000}
platform_size = {"w": 100, "h": 20}
platform_speeds = {"horizontal": {"x": 70, "y": 0}, "vertical": {"x": 0, "y": -70}}
rng = np.random.default_rng()


class Platform:
    def __init__(self, pos, direction=1, platform_type="basic", has_collectable=False, has_enemy=False):
        """
        Initializes attributes.
        :param pos: Grid position.
        :param platform_type: String: Type of platform.
        :param has_collectable: boolean
        :param has_enemy: boolean
        """
        self.pos = pos
        self.type = platform_type
        self.has_collectable = has_collectable
        self.has_enemy = has_enemy
        if self.type == "horizontal" or self.type == "vertical":
            self.velocity = platform_speeds[self.type].copy()
            self.velocity["x"] *= direction

    def get_grid_space(self, axis: str):
        """
        Returns the amount of grid spaces that the platform requires and reserves in a grid of the LevelGenerator.
        :param axis: string x or y direction.
        :return: grid space on axis.
        """
        grid_space_y = np.arange(self.pos["y"], self.pos["y"] + 15) if type != "dummy" else np.arange(self.pos.y,
                                                                                                      self.pos["y"] + 5)
        if axis in ["x", "X"]:
            return self.pos["x"]
        if axis in ["y", "Y"]:
            return grid_space_y
        else:
            return None

    def as_dict(self):
        """
        Calculates game map position and creates a platform dictionary from class attributes.
        :return:
        """
        if self.type in ["horizontal", "vertical"]:
            platform_dict = {"x": int(self.pos["x"] * platform_size["w"]),
                             "y": int(world_bounds["h"] - self.pos["y"] * platform_size["h"]),
                             "type": self.type, "has_collectable": self.has_collectable,
                             "has_enemy": self.has_enemy, "velocity": self.velocity}
        else:
            platform_dict = {"x": int(self.pos["x"] * platform_size["w"]),
                             "y": int(world_bounds["h"] - self.pos["y"] * platform_size["h"]),
                             "type": self.type, "has_collectable": self.has_collectable, "has_enemy": self.has_enemy}
        return platform_dict


class Structure(ABC):
    """
    Superclass for Structures.
    """

    def __init__(self, start_pos, direction=1):
        """
        Initializes attributes.
        :param start_pos: Dictionary with x and y keys.
        :param invert: Boolean inverted orientation.
        """
        self.pos = start_pos
        self.direction = direction
        self.platforms = self.create_platforms()

    @abstractmethod
    def create_platforms(self) -> tuple:
        """
        Derived implementations must return a list of Platform objects.
        """
        pass

    def get_platforms(self):
        """
        :return: A list of platforms transformed to dict.
        """
        platform_list = [platform.as_dict() for platform in self.platforms if
                         platform.type not in ["dummy", "dummyend"]]
        return platform_list

    def get_last_pos(self):
        """
        :return: The position of the last platform in the structure.
        """
        return self.platforms[-1].pos


class SimpleAscend(Structure):
    """
        Specific structure (child) class.
    """
    def __init__(self, start_pos, direction=1):
        super().__init__(start_pos, direction)

    def create_platforms(self):
        platform_list = [Platform({"x": self.pos["x"] + 1 * self.direction,
                                   "y": self.pos["y"]}),
                         Platform({"x": self.pos["x"] + 2 * self.direction,
                                   "y": self.pos["y"] + rng.choice([5, 6, 7])})]
        return platform_list


class SimpleForward(Structure):
    """
        Specific structure (child) class.
    """
    def __init__(self, start_pos, direction=1):
        super().__init__(start_pos, direction)

    def create_platforms(self):
        platform_list = [Platform({"x": self.pos["x"] + 1 * self.direction,
                                   "y": self.pos["y"]}),
                         Platform({"x": self.pos["x"] + 3 * self.direction,
                                   "y": self.pos["y"] + rng.choice([1, -1])})]
        return platform_list


class Turn(Structure):
    """
        Specific structure (child) class.
        Marking a turn of direction to mark the start of a new row in level generation.
    """

    def __init__(self, start_pos, direction=1):
        super().__init__(start_pos, direction)

    def create_platforms(self):
        platform_list = [Platform({"x": self.pos["x"] + 1 * self.direction,
                                   "y": self.pos["y"] + 9}),
                         Platform({"x": self.pos["x"] + 1 * self.direction,
                                   "y": self.pos["y"] + 16}, platform_type="dummy")
                         ]
        return platform_list


class Horizontal(Structure):
    """
        Specific structure (child) class.
        Horizontally moving platform.
    """

    def __init__(self, start_pos, direction=1):
        super().__init__(start_pos, direction)

    def create_platforms(self):
        platform_list = [Platform({"x": self.pos["x"] + 1 * self.direction, "y": self.pos["y"]}, self.direction,
                                  "horizontal"),
                         Platform({"x": self.pos["x"] + 2 * self.direction, "y": self.pos["y"]}, self.direction,
                                  "dummy"),
                         Platform({"x": self.pos["x"] + 3 * self.direction, "y": self.pos["y"]}, self.direction,
                                  "dummy"),
                         Platform({"x": self.pos["x"] + 4 * self.direction, "y": self.pos["y"]}, self.direction,
                                  "dummyend")
                         ]
        return platform_list


class Vertical(Structure):
    """
        Specific structure (child) class.
        Vertically moving platform.
    """

    def __init__(self, start_pos, invert=False):
        super().__init__(start_pos, invert)

    def create_platforms(self):
        platform_list = [
            Platform({"x": self.pos["x"] + 1 * self.direction, "y": self.pos["y"]}, self.direction, "vertical")]
        return platform_list


class LevelGenerator:
    """
    Procedural generator of level data.
    """

    def __init__(self):
        """
        Initializes all values and the random number generator instance.
        """
        self.reset()
        self.structures = [SimpleAscend, Horizontal, Vertical, SimpleForward]

    def can_platform_fit(self, platform: Platform):
        """
        Checks if a platform can be places on zeros in the grid.
        :param platform: platform to check.
        :return: boolean
        """
        in_x, in_y = self.in_grid(platform.pos)
        if not in_x or not in_y:
            return False
        x = platform.get_grid_space("x")
        y = platform.get_grid_space("y")

        try:
            grid_space = [self.grid[i][x] for i in y]

            if not all(space == 0 for space in grid_space):
                return False
        except IndexError:
            return False
        return True

    def can_structure_fit(self, structure: Structure):
        """
        Checks if each platform in a structure can fit on the grid,
        :param structure: structure to check.
        :return: boolean
        """
        if not all(self.can_platform_fit(platform) for platform in structure.platforms):
            return False
        return True

    def register_in_grid(self, platform: Platform):
        """
        Registers a platform in the grid.
        :param platform: platform to be registered.
        """
        x = platform.get_grid_space("x")
        y = platform.get_grid_space("y")
        for i in y:
            self.grid[i][x] = 1

    def in_grid(self, point):
        """
            Checks if a given point is inside the grid dimensions.
            :param point: Point to be checked.
            :return: Tuple with Boolean for x and y in grid.
        """
        is_in_grid_x = True
        is_in_grid_y = True
        if point["x"] not in np.arange(0, self.grid.shape[1]):
            is_in_grid_x = False
        if point["y"] not in np.arange(0, self.grid.shape[0]):
            is_in_grid_y = False
        return is_in_grid_x, is_in_grid_y

    def get_fitting_structure(self):
        """
        Randomly selects a Structure to be places at the active position.
        Retries up to 10 times if the selected structures can not fit.
        :return: A structure able to be placed on the grid.
        """
        for _ in np.arange(10):  # try 10 times
            structure = np.random.choice(self.structures)(self.active_pos, self.direction)
            if not self.can_structure_fit(structure):
                continue
            self.active_pos = structure.get_last_pos()
            deque(map(self.register_in_grid, structure.platforms))
            return structure
        return None

    def insert_turn(self):
        """
        Changes direction for the row generation in insert_rows.
        :return: structure used in a turn.
        """
        self.direction *= -1
        turn = Turn(self.active_pos, self.direction)
        self.active_pos = turn.get_last_pos()
        deque(map(self.register_in_grid, turn.platforms))
        return turn

    def insert_row(self):
        """
        Fills a row from grid border to grid border with structures.
        :return: list of structures for a row.
        """
        structures = []
        while True:
            structure = self.get_fitting_structure()
            if not structure:
                break
            structures.append(structure)
        return structures

    def insert_rows(self):
        """
        Fills a level row by row and with structures and makes turns on the grid border in x direction.
        :return: list of Structures of all rows.
        """
        level_structures = []
        while True:
            if self.active_pos["y"] >= self.grid.shape[0] - 30:
                break
            structures = self.insert_row()
            if not structures:
                structures = [self.insert_turn()]
            level_structures += structures

        return level_structures

    def generate_level(self, enemy_count: int, max_platforms=None):
        """
        Api Function to run the level row generation for a level and applies restrictions.
        :param enemy_count: Restriction on how many enemies should be created in the level.
        :param max_platforms: Restriction on the maximum amount of Platforms,
                                that should be taken from the generated level.
        :return: A dictionary of with a platform list that can be used in the Eduplay3 platformer.
        """
        structures = self.insert_rows()
        level_dict = {"platforms": []}

        # Get all platforms from the structures as dict.
        for structure in structures:
            level_dict["platforms"] += structure.get_platforms()

        # Cut off all platforms that are exceeding the max platform count.
        if max_platforms:
            level_dict["platforms"] = level_dict["platforms"][:max_platforms]


        level_dict["platforms"][len(level_dict["platforms"]) - 1]["type"] = "final"
        level_dict["platforms"][len(level_dict["platforms"]) - 1]["has_collectable"] = False
        self.reset()

        # Adding enemies on separate randomly chosen platforms
        enemy_platforms = set()
        while len(enemy_platforms) < enemy_count:
            enemy_platforms.add(rng.choice(np.arange(len(level_dict["platforms"]))))
        for index in enemy_platforms:
            level_dict["platforms"][index]["has_enemy"] = True

        # Adding collectables on separate randomly chosen platforms
        collectable_platforms = set()
        while len(collectable_platforms) < round(max_platforms / 5):
            collectable_platforms.add(rng.choice(np.arange(len(level_dict["platforms"]))))
        for index in collectable_platforms:
            level_dict["platforms"][index]["has_collectable"] = True

        return level_dict

    def reset(self):
        """
        Resets the Grid back to all zeros and chooses a new starting point for the next level.
        """
        self.grid = np.zeros([int(world_bounds["h"] / platform_size["h"]),
                              int(world_bounds["w"] / platform_size["w"])])
        self.direction = 1
        self.active_pos = {"x": int(rng.choice(range(2, 8))), "y": 2}
