# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Main Flask file to start the webserver.
"""

__authors__ = ["Luana Juhl", "Lukas Schult"]
__contact__ = "it16156@lehre.dhbw-stuttgart.de"
__credits__ = ["Luana Juhl", "Lukas Schult"]
__date__ = "2021/02/06"
__deprecated__ = False
__email__ = "it16156@lehre.dhbw-stuttgart.de"
__maintainer__ = "developer"
__status__ = "Released"
__version__ = "1.0"


import numpy as np
from abc import ABC, abstractmethod

world_bounds = {"w": 1600, "h": 2000}
platform_size = {"w": 100, "h": 20}


class Platform:
    """
    Platform used in Structures.
    """
    def __init__(self, pos, platform_type, has_collectable=False):
        """
        Initializes attributes.
        :param pos: Grid position.
        :param platform_type: String: Type of platform.
        :param has_collectable: Boolean.
        """
        self.pos = pos
        self.type = platform_type
        self.has_collectable = has_collectable

    def as_dict(self):
        """
        Calculates game map position and creates a platform dictionary from class attributes.
        :return:
        """
        return {"x": self.pos["x"] * platform_size["w"], "y": world_bounds["h"] - self.pos["y"] * platform_size["h"],
                "type": self.type, "has_collectable": self.has_collectable}


class Structure(ABC):
    """
    Superclass for Structures.
    """
    def __init__(self, start_pos, invert=False):
        """
        Initializes attributes.
        :param start_pos: Dictionary with x and y keys.
        :param invert: Boolean inverted orientation.
        """
        self.pos = start_pos
        self.direction = -1 if invert else 1
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
        platform_list = [platform.as_dict() for platform in self.platforms]
        return platform_list

    def get_last_pos(self):
        """
        :return: The position of the last platform in the structure.
        """
        return self.platforms[-1].pos


class S1(Structure):
    """
    Specific structure (child) class.
    """
    def __init__(self, start_pos, invert=False):
        super().__init__(start_pos, invert)

    def create_platforms(self):
        platform_list = [Platform(self.pos, "basic"),
                         Platform({"x": self.pos["x"] + 2 * self.direction,
                                   "y": self.pos["y"] + 5}, "basic")]
        return platform_list


class S2(Structure):
    """
        Specific structure (child) class.
    """
    def __init__(self, start_pos, invert=False):
        super().__init__(start_pos, invert)

    def create_platforms(self):
        platform_list = [Platform({"x": self.pos["x"],
                                   "y": self.pos["y"] + 5}, "basic"),
                         Platform({"x": self.pos["x"] + 3 * self.direction,
                                   "y": self.pos["y"] + 7}, "basic", has_collectable=True)]
        return platform_list


class S3(Structure):
    """
        Specific structure (child) class.
    """
    def __init__(self, start_pos, invert=False):
        super().__init__(start_pos, invert)

    def create_platforms(self):
        platform_list = [Platform({"x": self.pos["x"],
                                   "y": self.pos["y"] - 2}, "basic"),
                         Platform({"x": self.pos["x"] + 1 * self.direction,
                                   "y": self.pos["y"] - 3}, "basic")]
        return platform_list


class S4(Structure):
    """
        Specific structure (child) class.
    """
    def __init__(self, start_pos, invert=False):
        super().__init__(start_pos, invert)

    def create_platforms(self):
        platform_list = [Platform(self.pos, "basic", has_collectable=True),
                         Platform({"x": self.pos["x"] + 3 * self.direction,
                                   "y": self.pos["y"]}, "basic")]
        return platform_list


class S5(Structure):
    """
        Specific structure (child) class.
    """
    def __init__(self, start_pos, invert=False):
        super().__init__(start_pos, invert)

    def create_platforms(self):
        platform_list = [Platform(self.pos, "basic"),
                         Platform({"x": self.pos["x"] + 1 * self.direction,
                                   "y": self.pos["y"] + 7}, "basic", has_collectable=True)]
        return platform_list


class LevelGenerator:
    """
    Procedural generator of level data.
    """
    def __init__(self, min_platforms=20, max_platforms=40):
        """
        Initializes all values and the random number generator instance.
        :param min_platforms: The minimum amount of platforms a level can have.
        :param max_platforms: The amount of platforms needed to stop generation early.
        """
        self.grid = np.zeros([int(world_bounds["h"] / platform_size["h"]),
                              int(world_bounds["w"] / platform_size["w"])])
        self.structures = [S1, S2, S3, S4, S5]
        self.min_platforms = min_platforms
        self.max_platforms = max_platforms
        self.rng = np.random.default_rng()

    def register_in_grid(self, platforms):
        """
        Enters all positions of platforms on the grid.
        For each platform a space of 10 below and above will be reserved as well.
        :param platforms: List of platforms.
        """
        for platform in platforms:
            for i in range(max(platform.pos["y"] - 10, 0), platform.pos["y"] + 11):
                self.grid[i][platform.pos["x"]] = 1

    def grid_space_free(self, pos):
        """
        Checks if a position on the grid is 0.
        :param pos: position to check.
        :return: True if 0 on grid position else False.
        """
        return True if self.grid[pos["y"]][pos["x"]] == 0 else False

    def in_grid(self, point):
        """
        Checks if a given point is inside the grid dimensions.
        :param point: Point to be checked.
        :return: Tuple with Boolean for x and y in grid.
        """
        is_in_grid_x = True
        is_in_grid_y = True
        if point["x"] not in range(0, self.grid.shape[1]):
            is_in_grid_x = False
        if point["y"] not in range(0, self.grid.shape[0]):
            is_in_grid_y = False
        return is_in_grid_x, is_in_grid_y

    def get_fitting_structure(self, pos, right_to_left):
        """
        Randomly chooses a Structure and checks if the new structure can fit on the grid and retries up to 10 times.
        :param pos: Grid starting position.
        :param right_to_left: Direction indicator.
        :return: A fitting structure or None after 10 retries.
        """
        retries = 10
        while retries > 0:
            structure = self.rng.choice(self.structures)
            s = structure(pos, right_to_left)
            if self.in_grid(s.get_last_pos())[0] and not self.is_blocking(s):
                return s
            retries -= 1
        return None

    def is_blocking(self, structure):
        """
        Checks if all platforms of a given structure are overlapping on the grid.
        :param structure: Platform to check.
        :return: True if any platform is overlapping else False.
        """
        for platform in structure.platforms:
            try:
                if not self.grid_space_free(platform.pos):
                    return True
            except IndexError:
                return False
        return False

    def generate_level(self):
        """
        Attempts level generation until a level with the minimum amount of platforms is generated.
        :return: A level dictionary.
        """
        while True:
            level = self.gen_new()
            if len(level["platforms"]) > self.min_platforms:
                return level

    def append_multiples(self, recent_structures, new_structure):
        """
        Appends a structure to a List of structures of the same type or replace the current type in the structure list.
        :param recent_structures: List of structures (can also be empty).
        :param new_structure: Structure to be appended to the list.
        :return: The modified list.
        """
        if not recent_structures:
            recent_structures = [new_structure]
        if isinstance(new_structure, type(recent_structures[0])):
            recent_structures.append(new_structure)
        else:
            recent_structures = [new_structure]
        return recent_structures

    def gen_new(self):
        """
        Generates a new level.
        :return: Level Dictionary.
        """
        pos = {"x": int(self.rng.choice(range(2, 8))), "y": 1}
        level_dict = {"platforms": []}
        right_to_left = False
        retries = 10
        recent_structures = []
        while self.in_grid(pos)[1]:  # only run, if the pos value is within the world bounds height.
            s = self.get_fitting_structure(pos, right_to_left)
            if s is None:
                # No fitting platform was found.
                # Reduce retries and change the direction and offset the position by 3 in the new direction.
                retries -= 1
                pos["x"] = pos["x"] + 3 if right_to_left else pos["x"] - 3
                right_to_left = not right_to_left
            else:
                recent_structures = self.append_multiples(recent_structures, s)
                if len(recent_structures) > 2:
                    # retry generating a new structure if the same structure is selected the 3. time in a row
                    continue
                retries = 10
                pos = s.get_last_pos().copy()
                step = int(self.rng.choice([1, 2]))  # cast to avid np int32 datatype
                # randomly insert a space between structures.
                pos["x"] = pos["x"] - step if right_to_left else pos["x"] + step
                try:
                    self.register_in_grid(s.platforms)
                    level_dict["platforms"] += s.get_platforms()
                except IndexError:
                    pass
            if retries == 0 or len(level_dict["platforms"]) >= self.max_platforms:
                break
        # replace the last generated platform type with the final type.
        level_dict["platforms"][len(level_dict["platforms"]) - 1]["type"] = "final"
        level_dict["platforms"][len(level_dict["platforms"]) - 1]["has_collectable"] = False
        self.grid = np.zeros([int(world_bounds["h"] / platform_size["h"]),
                              int(world_bounds["w"] / platform_size["w"])])

        return level_dict
